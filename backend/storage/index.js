const Devices = require("./devices");
const Session = require("./session");
const OAuth = require("./oauth");
const UserProperties = require("./user-properties");
const Audit = require("./audit");
const config = require("../config");

module.exports = class {
  constructor(sequelize) {
    this.session = new Session(sequelize);
    this.oauth = new OAuth(sequelize);
    this.devices = new Devices(sequelize);
    this.userProperties = new UserProperties(sequelize);
    this.audit = new Audit(sequelize);

    if (config.updateDatabaseSchema) {
      sequelize.sync({ alter: true }).catch(error => {
        console.error(error.message);
        process.exit(1);
      });
    }
  }
};
