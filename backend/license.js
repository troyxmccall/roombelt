const ms = require("ms");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const config = require("./config");

const licensePublicKey = `
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE5NGkvvkLIl9gp1pJ9aY8We5Zhnhh
WAt+IYZmCpEkkv3KUmDq7HYRyJfka7pgopF2z8QVkc4eHQMtQIX2n3KSiw==
-----END PUBLIC KEY-----
`;

function verifyLicense(showDaysLeftMessage = false) {
  try {
    const license = jwt.verify(config.licenseKey, licensePublicKey, { algorithms: ["ES256"] });

    module.exports = {
      productId: license.productId,
      customerName: license.customerName,
      customerEmail: license.customerEmail,
      expirationTimestamp: license.exp * 1000
    };

    if (showDaysLeftMessage) {
      const daysTillExpire = Math.floor((license.exp * 1000 - Date.now()) / ms("1 day"));
      console.log(chalk.yellow(`\nWARNING: Roombelt license for ${license.customerName} (${license.customerEmail}) expires in ${daysTillExpire} days.\n`));
    }
  } catch (e) {
    const getErrorMessage = () => {
      if (!config.licenseKey) return "Error: Roombelt license is missing.";
      if (e instanceof jwt.TokenExpiredError) return "Error: Your Roombelt license has expired.";

      return "Error: Your Roombelt license is invalid.";
    };

    /**
     * ***** IMPORTANT *****
     * Before removing this code consider ordering Roombelt license for your organization. You can use
     * the same license for development as well.
     * I am an indie dev that put a lot of work in developing and maintaining the product.
     * By buying a license you support these efforts.
     */
    console.log(chalk.red("\n" + getErrorMessage()));
    console.log(chalk.red("Order a new license at https://roombelt.com/pricing.html#buy or try the Cloud version at https://app.roombelt.com\n"));

    process.exit(1);
  }
}

verifyLicense(true);
setInterval(verifyLicense, ms("1 hour"));