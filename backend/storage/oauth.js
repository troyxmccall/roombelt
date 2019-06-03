const Sequelize = require("sequelize");

module.exports = class {
  constructor(sequelize) {
    this.Model = this.Model = sequelize.define("oauth", {
      // oauth
      userId: { type: Sequelize.STRING, primaryKey: true },
      tenantId: Sequelize.TEXT,
      provider: Sequelize.STRING,
      accessToken: Sequelize.TEXT,
      refreshToken: Sequelize.TEXT,

      // subscriptions
      subscriptionPassthrough: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      subscriptionId: Sequelize.INTEGER,
      subscriptionPlanId: Sequelize.INTEGER,
      subscriptionUpdateUrl: Sequelize.TEXT,
      isSubscriptionCancelled: { type: Sequelize.BOOLEAN, defaultValue: false }
    });
  }

  async saveTokens({ userId, tenantId, accessToken, refreshToken, provider }) {
    const fieldsToUpdate = refreshToken ? ["accessToken", "refreshToken", "provider"] : ["accessToken", "provider"];
    await this.Model.upsert({ userId, tenantId, accessToken, refreshToken, provider }, { fields: fieldsToUpdate });
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
