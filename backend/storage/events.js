const Sequelize = require("sequelize");

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
      "events",
      {
        userId: Sequelize.STRING,
        deviceId: Sequelize.STRING,
        meetingId: Sequelize.STRING,
        meetingSummary: Sequelize.STRING,
        recurringMasterId: Sequelize.STRING,
        eventType: Sequelize.ENUM(Object.values(EventTypes)),
        createdAt: Sequelize.DATE
      },
      { indexes: [{ fields: ["userId", "deviceId", "meetingId", "recurringMasterId", "eventType"] }] }
    );
  }

  async logEvent(userId, deviceId, meetingId, recurringMasterId, meetingSummary, eventType) {
    const model = this.Model.build({
      userId,
      deviceId,
      meetingId,
      recurringMasterId,
      meetingSummary,
      eventType
    });

    await model.save();
  }

  async findEvents(userId, deviceId = null, meetingId = null, eventType = null, meetingSummary = null) {
    const criteria = { userId };
    if (deviceId) criteria.deviceId = deviceId;
    if (meetingId) criteria.meetingId = meetingId;
    if (eventType) criteria.deviceId = eventType;
    if (meetingSummary) criteria.meetingSummary = { [Sequelize.Op.like]: meetingSummary.trim() };

    return await this.Model.findAll({ where: criteria, order: ["createdAt", "DESC"], limit: 100 });
  }

  async findLastRecurringMeetingEvents(deviceId, recurringMasterId) {
    return await this.Model.findAll({
      where: { deviceId, recurringMasterId },
      order: ["createdAt", "DESC"],
      limit: 10
    });
  }
};

module.exports.EventTypes = EventTypes;
