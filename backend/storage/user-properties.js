const Sequelize = require("sequelize");

module.exports = class {
  constructor(sequelize) {
    this.Model = sequelize.define("userProperty", {
      userId: { type: Sequelize.STRING, primaryKey: true },
      propertyId: { type: Sequelize.STRING, primaryKey: true },
      value: Sequelize.STRING
    });
  }

  async setProperty(userId, propertyId, value) {
    await this.Model.upsert({ userId, propertyId, value: JSON.stringify(value) });
  }

  async getProperties(userId) {
    const rows = await this.Model.findAll({ where: { userId } });
    const result = {};

    rows.forEach(row => result[row.propertyId] = JSON.parse(row.value));

    return result;
  }
};
