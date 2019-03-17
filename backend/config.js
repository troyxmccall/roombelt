const path = require("path");
const chalk = require("chalk");

require("dotenv").config({ path: path.resolve(process.cwd(), "roombelt.env") });

const result = {
  google: {
    clientId: process.env["GOOGLE_CLIENT_ID"],
    clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
    redirectUrl: process.env["GOOGLE_REDIRECT_URL"],
    webHookUrl: process.env["GOOGLE_WEB_HOOK_URL"]
  },

  office365: {
    clientId: process.env["OFFICE365_CLIENT_ID"],
    clientSecret: process.env["OFFICE365_CLIENT_SECRET"],
    redirectUrl: process.env["OFFICE365_REDIRECT_URL"],
  },

  databaseUrl: process.env["DATABASE_URL"],
  forceHttps: process.env["FORCE_HTTPS"] === "true" || process.env["FORCE_HTTPS"] === "1",
  disableFrameGuard: process.env["DISABLE_FRAME_GUARD"] === "true" || process.env["DISABLE_FRAME_GUARD"] === "1",
  port: process.env["PORT"] || 3000,
  acceptHost: process.env["ACCEPT_HOST"] || undefined,
  logLevel: (process.env["LOG_LEVEL"] || "debug").toLowerCase(),
  paddleVendorId: process.env["PADDLE_VENDOR_ID"] || "",
  paddlePublicKey: process.env["PADDLE_PUBLIC_KEY"] || "",
  paddleApiKey: process.env["PADDLE_API_KEY"] || ""
};

if (!result.databaseUrl) {
  console.log(chalk.red("Error: Database connection string has not been provided."));
  console.log(chalk.red("Take a look at https://docs.roombelt.com/installing-locally for instructions."));
  process.exit(1);
}

module.exports = result;
