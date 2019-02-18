const router = require("express-promise-router")();
const verifyPaddleAlert = require("../services/verify-paddle-alert");

router.post("/paddle", async (req, res) => {
  if (!verifyPaddleAlert(req.body)) {
    return res.sendStatus(400);
  }

  const event = req.body.alert_name;
  const subscriptionPassthrough = req.body.passthrough;
  const subscriptionId = req.body.subscription_id;
  const subscriptionPlanId = req.body.subscription_plan_id;
  const subscriptionCancellationEffectiveTimestamp = new Date(req.body.cancellation_effective_date).getTime();

  const user = await req.context.storage.oauth.getBySubscriptionPassthrough(subscriptionPassthrough);

  if (!user) {
    return res.sendStatus(400);
  }

  switch (event) {
    case "subscription_created":
    case "subscription_updated":
      await req.context.storage.oauth.updateSubscription(user.userId, subscriptionId, subscriptionPlanId);
      break;
    case "subscription_cancelled":
      await req.context.storage.oauth.cancelSubscription(user.userId, subscriptionCancellationEffectiveTimestamp);
      break;
  }
  res.sendStatus(200);
});

module.exports = router;
