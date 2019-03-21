const router = require("express-promise-router")();

router.get("/oauth_callback", require("./context"), async (req, res) => {
  if (req.query.error === "access_denied") {
    return res.redirect("/");
  }

  if (req.query && req.query["admin_consent"] === "True") {
    return res.redirect("/admin");
  }

  if (!req.query || !req.query.code) {
    return res.sendStatus(400);
  }

  const tokens = await req.context.calendarProviders.office365.getAuthTokens(req.query.code).then(undefined, err => console.log(err));

  if (!tokens) {
    return res.sendStatus(401);
  }

  await req.context.storage.oauth.saveTokens(tokens);

  await req.context.storage.session.updateSession(req.context.session.token, {
    userId: tokens.userId,
    scope: "admin"
  });

  if (!await req.context.calendarProviders.office365.isAccessTokenValid()) {
    return res.redirect(req.context.calendarProviders.office365.getAdminAuthUrl());
  }

  return res.redirect("/admin");
});

module.exports = router;
