import Moment from "moment";
import ms from "ms";
import premiumPlans from "services/premium-plans";

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

  if (state.monetization.isCheckoutOverlayOpen || state.monetization.isCancelSubscriptionDialogOpen || state.monetization.isUpdatingSubscription) {
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

export const isOnPremisesSelector = state => currentSubscriptionPlanSelector(state) === premiumPlans.ON_PREMISES;

export const isOnPremisesPaidPlan = state => {
  if (!isOnPremisesSelector(state)) {
    return false;
  }
  return state.user && state.user.properties && state.user.properties.lastAcceptanceOfEvaluation > Date.now();
};

export const isOnPremisesEvaluationExpiredDialogOpenSelector = state => {
  if (!isOnPremisesSelector(state)) {
    return false;
  }

  if (state.monetization.isCheckoutOverlayOpen) {
    return false;
  }

  if (state.monetization.isChoosePlanDialogOpenByUser) {
    return true;
  }

  if (!state.user || !state.user.properties) {
    return false;
  }

  if(!state.user.properties.lastAcceptanceOfEvaluation) {
    return true;
  }

  return (state.user.properties.lastAcceptanceOfEvaluation < Date.now() - ms("2 weeks"));
};

export const daysSinceJoinedSelector = state => {
  if (!state.user || !state.user.createdAt) {
    return 0;
  }

  return Math.floor((Date.now() - state.user.createdAt) / ms("1 day"));
};

export const subscriptionPassthroughSelector = state => state.user.subscriptionPassthrough;
export const subscriptionUpdateUrlSelector = state => state.user.subscriptionUpdateUrl;
export const currentSubscriptionPlanSelector = state => premiumPlans[state.user.subscriptionPlanId];

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

