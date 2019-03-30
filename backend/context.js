const router = require("express-promise-router")();
const Sequelize = require("sequelize");
const Moment = require("moment");
const Storage = require("./storage");
const config = require("./config");
const premiumPlans = require("./services/premium-plans");

const GoogleCalendar = require("./services/google-calendar");
const Office365Calendar = require("./services/office365-calendar");

const storage = new Storage(
  new Sequelize(config.databaseUrl, {
    logging: process.env.NODE_ENV !== "production" && console.log,
    operatorsAliases: false
  })
);

async function getSubscriptionStatus(oauth) {
  if (!config.paddleApiKey || !oauth) {
    return null;
  }

  const isSubscriptionCancelled = oauth.isSubscriptionCancelled;

  const now = Moment();
  const endOfTrial = Moment(oauth.createdAt).add(30, "days");
  const firstOfApril = Moment([2019, 3, 1]);
  const isTrialExpired = !oauth.subscriptionPlanId && now.isAfter(endOfTrial) && now.isAfter(firstOfApril);
  const isTrialLongExpired = isTrialExpired && now.isAfter(endOfTrial.add(3, "days")) && now.isAfter(firstOfApril.add(3, "days"));

  const currentPlan = premiumPlans[oauth.subscriptionPlanId];
  const connectedDevicesCount = storage.devices.countDevicesForUser(oauth.userId);
  const isUpgradeRequired = currentPlan && currentPlan.maxDevices < connectedDevicesCount;

  return {
    isAdminPanelBlocked: isSubscriptionCancelled || isUpgradeRequired || isTrialExpired,
    areDevicesBlocked: isSubscriptionCancelled || isUpgradeRequired || isTrialLongExpired
  };
}

router.use(async (req, res) => {
  const session = await storage.session.getSession(req.cookies.sessionToken) || await storage.session.createSession();

  const oauth = await storage.oauth.getByUserId(session.userId);
  const googleCalendarProvider = new GoogleCalendar(config.google, (oauth && oauth.provider === "google") ? oauth : null);
  const office365CalendarProvider = new Office365Calendar(config.office365, (oauth && oauth.provider) === "office365" ? oauth : null);
  const subscriptionStatus = await getSubscriptionStatus(oauth);

  req.context = {
    storage,
    calendarProvider: oauth && (oauth.provider === "office365" ? office365CalendarProvider : googleCalendarProvider),
    calendarProviders: {
      google: googleCalendarProvider,
      office365: office365CalendarProvider
    },
    session,
    subscriptionStatus,
    removeSession: async () => {
      await storage.session.deleteSession(req.context.session.token);
      res.clearCookie("sessionToken", { httpOnly: true });
    }
  };

  const day = 1000 * 60 * 60 * 24;
  const year = day * 365;

  const sessionTimeout = session.scope === "admin" ? day : year;

  res.cookie("sessionToken", session.token, { httpOnly: true, maxAge: sessionTimeout });

  return "next";
});

module.exports = router;
