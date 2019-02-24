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
      subscriptionUpdateUrl: Sequelize.TEXT,
      isSubscriptionCancelled: { type: Sequelize.BOOLEAN, defaultValue: false }
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

  async createSubscription(userId, subscriptionId, subscriptionPlanId, subscriptionUpdateUrl) {
    await this.Model.upsert({
      userId,
      subscriptionId,
      subscriptionPlanId,
      subscriptionUpdateUrl,
      isSubscriptionCancelled: false
    });
  }

  async updateSubscription(userId, subscriptionPlanId) {
    await this.Model.update({ subscriptionPlanId }, { where: { userId } });
  }

  async cancelSubscription(userId) {
    await this.Model.update({ isSubscriptionCancelled: true }, { where: { userId } });
  }
};
