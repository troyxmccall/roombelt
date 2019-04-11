const router = require("express-promise-router")();

router.get("/oauth_callback", require("./context"), async (req, res) => {
  if (req.query.error === "access_denied") {
    return res.redirect("/");
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

  return res.redirect("/office365/check_access");
});

router.get("/oauth_callback_admin", require("./context"), async (req, res) => {
  if (req.query && req.query["admin_consent"] === "True" && !req.query["error"]) {
    for (let i = 0; i < 10; i++) {
      if (await req.context.calendarProviders.office365.isAccessTokenValid()) {
        return res.redirect("/admin");
      }

      await new Promise(res => setTimeout(res, 1000));
      await req.context.calendarProviders.office365.refreshAccessToken();
    }
  }

  return res.status(400).send(`
    <html lang="en">
      <body>
        <h1>Authorization error</h1>
        <p>Ensure that you use a school or work account. Roombelt does not support personal Office365 accounts.</p>
        <p>If this problem continues to occur <a href="mailto:mateusz@roombelt.com">contact support</a>.</p>
        <a href="/">Back</a>
      </body>
    </html>
`)
});

router.get("/check_access", require("./context"), async (req, res) => {
  if (!await req.context.calendarProviders.office365.isAccessTokenValid()) {
    return res.redirect(req.context.calendarProviders.office365.getAdminAuthUrl());
  }

  return res.redirect("/admin");
});
module.exports = router;
