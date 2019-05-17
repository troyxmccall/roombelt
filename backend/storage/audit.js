const Sequelize = require("sequelize");
const ms = require("ms");

const EventTypes = {
  CREATE: "create",
  START_EARLY: "start-early",
  CHECK_IN: "check-in",
  EXTEND: "extend",
  END: "end",
  CANCEL: "cancel",
  AUTO_CANCEL: "auto-cancel",
  AUTO_CANCEL_RECURRING: "auto-cancel-recurring"
};

module.exports = class {
  constructor(sequelize) {
    this.Model = sequelize.define(
      "audit",
      {
        userId: Sequelize.STRING,
        deviceId: Sequelize.STRING,
        calendarId: Sequelize.STRING,
        meetingId: Sequelize.STRING,
        meetingSummary: Sequelize.STRING,
        recurringMasterId: Sequelize.STRING,
        eventType: Sequelize.STRING,
        createdAt: Sequelize.DATE
      },
      { indexes: [{ fields: ["userId", "deviceId", "calendarId", "meetingId", "recurringMasterId", "eventType"] }] }
    );
  }

  async logEvent(userId, deviceId, calendarId, meetingId, recurringMasterId, meetingSummary, eventType) {
    const model = this.Model.build({
      userId,
      deviceId,
      calendarId,
      meetingId,
      recurringMasterId,
      meetingSummary,
      eventType
    });

    await model.save();
  }

  async findEvents(userId) {
    const where = { userId, createdAt: { [Sequelize.Op.gt]: new Date(Date.now() - ms("7 days")) } };
    return await this.Model.findAll({ where, order: [["createdAt", "DESC"]], limit: 5000 });
  }

  async findLastRecurringMeetingEvents(deviceId, recurringMasterId) {
    return await this.Model.findAll({
      where: { deviceId, recurringMasterId },
      order: [["createdAt", "DESC"]],
      limit: 2
    });
  }
};

module.exports.EventTypes = EventTypes;
