const router = require("express-promise-router")();
const jwt = require("jsonwebtoken");
const paddle = require("../services/paddle");
const logger = require("../logger");
const context = require("../context");
const config = require("../config");

const licensePrivateKey = `-----BEGIN EC PRIVATE KEY-----\n${config.licenseGeneratorPrivateKey}\n-----END EC PRIVATE KEY-----`;

router.post("/paddle/on-premises/license", context.emptyContext, async (req, res) => {
  if (!paddle.verifyPaddleAlert(req.body)) {
    return res.sendStatus(400);
  }

  const license = jwt.sign({
    productId: req.body.p_product_id,
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail
  }, licensePrivateKey, {
    algorithm: "ES256",
    expiresIn: "1 year",
    issuer: "roombelt.com"
  });

  res.send(license);
});

router.post("/paddle/on-premises/trial", context.emptyContext, async (req, res) => {
  if (!paddle.verifyPaddleAlert(req.body)) {
    return res.sendStatus(400);
  }

  const license = jwt.sign({
    productId: req.body.p_product_id,
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail
  }, licensePrivateKey, {
    algorithm: "ES256",
    expiresIn: "2 weeks",
    issuer: "roombelt.com"
  });

  res.send(license);
});

router.post("/paddle/cloud/subscription", context.emptyContext, async (req, res) => {
  if (!paddle.verifyPaddleAlert(req.body)) {
    return res.sendStatus(400);
  }

  const event = req.body.alert_name;
  const subscriptionPassthrough = req.body.passthrough;
  const subscriptionId = req.body.subscription_id;
  const subscriptionPlanId = req.body.subscription_plan_id;
  const subscriptionUpdateUrl = req.body.update_url;

  const user = await req.context.storage.oauth.getBySubscriptionPassthrough(subscriptionPassthrough);

  logger.debug(`Received paddle event ${event} for passthrough ${subscriptionPassthrough}`);

  if (!user) {
    return res.sendStatus(400);
  }

  switch (event) {
    case "subscription_created":
      await req.context.storage.oauth.createSubscription(
        user.userId,
        subscriptionId,
        subscriptionPlanId,
        subscriptionUpdateUrl
      );
      break;
    case "subscription_updated":
      await req.context.storage.oauth.updateSubscription(user.userId, subscriptionPlanId);
      break;
    case "subscription_cancelled":
      await req.context.storage.oauth.cancelSubscription(user.userId);
      break;
  }
  res.sendStatus(200);
});

module.exports = router;
