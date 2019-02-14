const router = require("express-promise-router")();
const Sequelize = require("sequelize");
const Storage = require("./storage");
const GoogleCalendar = require("./services/google-calendar");
const config = require("./config");

const storage = new Storage(
  new Sequelize(config.databaseUrl, {
    logging: process.env.NODE_ENV !== "production" && console.log,
    operatorsAliases: false
  })
);

router.use(async (req, res) => {
  const sessionToken = req.cookies.sessionToken || req.token;
  const session = await storage.session.getSession(sessionToken) || await storage.session.createSession();

  const calendarProvider = new GoogleCalendar(config, await storage.oauth.getTokens(session.userId));

  req.context = { storage, calendarProvider, session };

  const year = 1000 * 60 * 60 * 24 * 365;
  res.cookie("sessionToken", session.token, { httpOnly: true, maxAge: year });

  return "next";
});

module.exports = router;
