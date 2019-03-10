import ms from "ms";
import Moment from "moment";
import premiumPlans from "services/premium-plans";
import { upcomingPremiumAcknowledgedProperty } from "apps/admin/store/constants";

export const newDeviceDataSelector = state => ({
  connectionCode: state.connectDeviceWizard.connectionCode,
  deviceId: state.connectDeviceWizard.deviceId,
  calendarId: state.connectDeviceWizard.calendarId,
  deviceType: state.connectDeviceWizard.deviceType,
  language: state.connectDeviceWizard.language,
  clockType: state.connectDeviceWizard.clockType,
  showAvailableRooms: state.connectDeviceWizard.showAvailableRooms
});

export const editDeviceDataSelector = state => ({
  deviceId: state.editedDevice.data.id,
  deviceType: state.editedDevice.data.deviceType,
  calendarId: state.editedDevice.data.calendarId,
  language: state.editedDevice.data.language,
  clockType: state.editedDevice.data.clockType,
  minutesForCheckIn: state.editedDevice.data.minutesForCheckIn,
  showAvailableRooms: state.editedDevice.data.showAvailableRooms
});

export const removedDeviceIdSelector = state => state.removedDevice;

export const isCheckoutOverlayOpenSelector = state => state.monetization.isCheckoutOverlayOpen;

export const isUpcomingPremiumPopupVisibleSelector = state => {
  const isLoaded = state.user.isLoaded;
  const hasNotAcknowledgedYet = !state.user.properties[upcomingPremiumAcknowledgedProperty];
  const isOldUser = state.user.createdAt < Date.now() - ms("7 days");

  return isLoaded && isOldUser && hasNotAcknowledgedYet;
};

export const isCancelSubscriptionDialogOpenSelector = state => state.monetization.isCancelSubscriptionDialogOpen;

export const isUpdatingSubscriptionDialogOpen = state => state.monetization.isUpdatingSubscription;

export const isChoosePlanDialogOpenSelector = state => {
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

