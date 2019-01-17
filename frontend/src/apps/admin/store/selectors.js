export const newDeviceData = state => ({
  connectionCode: state.connectDeviceWizard.connectionCode,
  deviceId: state.connectDeviceWizard.deviceId,
  calendarId: state.connectDeviceWizard.calendarId,
  deviceType: state.connectDeviceWizard.deviceType,
  language: state.connectDeviceWizard.language,
  clockType: state.connectDeviceWizard.clockType
});

export const editDeviceData = state => ({
  deviceId: state.editedDevice.data.id,
  deviceType: state.editedDevice.data.deviceType,
  calendarId: state.editedDevice.data.calendarId,
  language: state.editedDevice.data.language,
  clockType: state.editedDevice.data.clockType,
  minutesForCheckIn: state.editedDevice.data.minutesForCheckIn
});

export const removedDeviceId = state => state.removedDevice;