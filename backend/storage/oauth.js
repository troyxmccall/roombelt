const Sequelize = require("sequelize");

module.exports = class {
  constructor(sequelize) {
    this.Model = this.Model = sequelize.define("oauth", {
      // google oauth
      userId: { type: Sequelize.STRING, primaryKey: true },
      accessToken: Sequelize.STRING,
      refreshToken: Sequelize.STRING,

      // subscriptions
      subscriptionPassthrough: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      subscriptionId: Sequelize.INTEGER,
      subscriptionPlanId: Sequelize.INTEGER,
      subscriptionCancellationEffectiveTimestamp: Sequelize.INTEGER
    });
  }

  async saveTokens({ userId, accessToken, refreshToken }) {
    const fieldsToUpdate = refreshToken ? ["accessToken", "refreshToken"] : ["accessToken"];
    await this.Model.upsert({ userId, accessToken, refreshToken }, { fields: fieldsToUpdate });
  }

  async getByUserId(userId) {
    return await this.Model.findByPk(userId);
  }

  async getBySubscriptionPassthrough(subscriptionPassthrough) {
    return await this.Model.findOne({ where: { subscriptionPassthrough } });
  }

  async updateSubscription(userId, subscriptionId, subscriptionPlanId) {
    await this.Model.upsert({
      userId,
      subscriptionId,
      subscriptionPlanId,
      subscriptionCancellationEffectiveTimestamp: null
    });
  }

  async cancelSubscription(userId, subscriptionCancellationEffectiveTimestamp) {
    await this.Model.upsert({ userId, subscriptionCancellationEffectiveTimestamp });
  }
};
