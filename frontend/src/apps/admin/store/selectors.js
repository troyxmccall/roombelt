import ms from "ms";
import { upcomingPremiumAcknowledgedProperty } from "apps/admin/store/constants";

export const newDeviceDataSelector = state => ({
  connectionCode: state.connectDeviceWizard.connectionCode,
  deviceId: state.connectDeviceWizard.deviceId,
  calendarId: state.connectDeviceWizard.calendarId,
  deviceType: state.connectDeviceWizard.deviceType,
  language: state.connectDeviceWizard.language,
  clockType: state.connectDeviceWizard.clockType
});

export const editDeviceDataSelector = state => ({
  deviceId: state.editedDevice.data.id,
  deviceType: state.editedDevice.data.deviceType,
  calendarId: state.editedDevice.data.calendarId,
  language: state.editedDevice.data.language,
  clockType: state.editedDevice.data.clockType,
  minutesForCheckIn: state.editedDevice.data.minutesForCheckIn
});

export const removedDeviceIdSelector = state => state.removedDevice;
export const isCheckoutOverlayOpenSelector = state => state.monetization.isCheckoutOverlayOpen;

export const isUpcomingPremiumPopupVisibleSelector = state => {
  const isLoaded = state.user.isLoaded;
  const hasNotAcknowledgedYet = !state.user.properties[upcomingPremiumAcknowledgedProperty];
  const isOldUser = state.user.createdAt < Date.now() - ms("7 days");

  return isLoaded && isOldUser && hasNotAcknowledgedYet;
};