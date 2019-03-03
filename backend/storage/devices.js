const Sequelize = require("sequelize");

module.exports = class {
  constructor(sequelize) {
    this.Model = sequelize.define("devices", {
      deviceId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      connectionCode: { type: Sequelize.STRING, defaultValue: () => Math.floor(Math.random() * 100000).toString() },
      userId: Sequelize.STRING,
      language: { type: Sequelize.STRING, defaultValue: "en-US" },
      clockType: { type: Sequelize.INTEGER, defaultValue: 24 },
      deviceType: { type: Sequelize.STRING, defaultValue: "calendar" },
      calendarId: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      minutesForCheckIn: { type: Sequelize.INTEGER, defaultValue: 0 }
    });
  }

  async createDevice() {
    const model = this.Model.build({});
    await model.save();
    return model;
  }

  async removeDevice(deviceId) {
    await this.Model.destroy({ where: { deviceId } });
  }

  async getDeviceById(deviceId) {
    return await this.Model.findByPk(deviceId);
  }

  async getDeviceByConnectionCode(connectionCode) {
    return await this.Model.findOne({ where: { connectionCode } });
  }

  async getDevicesForUser(userId) {
    return await this.Model.findAll({ where: { userId } });
  }

  async countDevicesForUser(userId) {
    return await this.Model.count({ where: { userId } });
  }

  async connectDevice(deviceId, userId) {
    await this.Model.update({ userId, connectionCode: null }, { where: { deviceId } });
  }

  async heartbeatDevice(deviceId) {
    await this.Model.update({}, { where: { deviceId } });
  }

  async setTypeForDevice(deviceId, deviceType) {
    await this.Model.update({ deviceType }, { where: { deviceId } });
  }

  async setCalendarForDevice(deviceId, calendarId) {
    await this.Model.update({ calendarId }, { where: { deviceId } });
  }

  async setLanguageForDevice(deviceId, language) {
    await this.Model.update({ language }, { where: { deviceId } });
  }

  async setClockTypeForDevice(deviceId, clockType) {
    await this.Model.update({ clockType }, { where: { deviceId } });
  }

  async setMinutesForCheckIn(deviceId, minutesForCheckIn) {
    await this.Model.update({ minutesForCheckIn }, { where: { deviceId } });
  }
};
