import Moment from "moment";
import getPricingPlans from "services/premium-plans";

export const newDeviceDataSelector = state => ({
  connectionCode: state.connectDeviceWizard.connectionCode,
  deviceId: state.connectDeviceWizard.deviceId,
  deviceType: state.connectDeviceWizard.deviceType,
  calendarId: state.connectDeviceWizard.calendarId,
  language: state.connectDeviceWizard.language,
  clockType: state.connectDeviceWizard.clockType
});

export const editDeviceDataSelector = state => ({
  deviceId: state.editedDevice.data.id,
  deviceType: state.editedDevice.data.deviceType,
  calendarId: state.editedDevice.data.calendarId,
  displayName: state.editedDevice.data.displayName && state.editedDevice.data.displayName.trim(),
  location: state.editedDevice.data.location,
  language: state.editedDevice.data.language,
  clockType: state.editedDevice.data.clockType,
  minutesForCheckIn: state.editedDevice.data.minutesForCheckIn,
  minutesForStartEarly: state.editedDevice.data.minutesForStartEarly,
  showAvailableRooms: state.editedDevice.data.showAvailableRooms,
  showTentativeMeetings: state.editedDevice.data.showTentativeMeetings,
  isReadOnlyDevice: state.editedDevice.data.isReadOnlyDevice,
  recurringMeetingsCheckInTolerance: state.editedDevice.data.recurringMeetingsCheckInTolerance
});

export const isAuditLogVisibleSelector = state => state.auditLog.isVisible;
export const isAuditLogLoadingSelector = state => state.auditLog.isLoading;
export const auditLogEntriesSelector = state => state.auditLog.entries;

export const isGoogleAccountSelector = state => state.user && state.user.provider === "google";

export const removedDeviceIdSelector = state => state.removedDevice;

export const isCheckoutOverlayOpenSelector = state => state.monetization.isCheckoutOverlayOpen;

export const isCancelSubscriptionDialogOpenSelector = state => state.monetization.isCancelSubscriptionDialogOpen;

export const isUpdatingSubscriptionDialogOpen = state => state.monetization.isUpdatingSubscription;

export const isChoosePlanDialogOpenSelector = state => {
  if (isOnPremisesSelector(state)) {
    return false;
  }

  if (
    state.monetization.isCheckoutOverlayOpen ||
    state.monetization.isCancelSubscriptionDialogOpen ||
    state.monetization.isUpdatingSubscription
  ) {
    return false;
  }

  if (state.monetization.isChoosePlanDialogOpenByUser) {
    return true;
  }

  // Check if we have to force open the dialog
  if (state.user.isLoaded) {
    const currentPlan = currentSubscriptionPlanSelector(state);
    const connectedDevices = connectedDevicesSelector(state);
    const daysOfTrialLeft = daysOfTrialLeftSelector(state);

    return (currentPlan && currentPlan.maxDevices < connectedDevices.length) || (!currentPlan && daysOfTrialLeft <= 0);
  }

  return false;
};

export const isOnPremisesSelector = state => {
  const currentPlan = currentSubscriptionPlanSelector(state);
  return currentPlan && currentPlan.subscriptionPlanId === 1;
};

export const subscriptionPassthroughSelector = state => state.user.subscriptionPassthrough;
export const subscriptionUpdateUrlSelector = state => state.user.subscriptionUpdateUrl;
export const currentSubscriptionPlanSelector = state =>
  getPricingPlans(userCreatedAtSelector(state))[state.user.subscriptionPlanId];

export const userCreatedAtSelector = state => state.user.createdAt;
export const daysOfTrialLeftSelector = state => {
  if (currentSubscriptionPlanSelector(state) || !state.user.subscriptionTrialEndTimestamp) {
    return 0;
  }

  return Moment(state.user.subscriptionTrialEndTimestamp).diff(Moment(), "days");
};

export const connectedDevicesSelector = state => state.devices.data;

export const canConnectAnotherDeviceSelector = state => {
  if (daysOfTrialLeftSelector(state) > 0) {
    return true;
  }

  const currentPlan = currentSubscriptionPlanSelector(state);
  return currentPlan && currentPlan.maxDevices > state.devices.data.length;
};
