import { action } from "utils/redux";

import {
  connectDevice,
  disconnectDevice,
  getCalendars,
  getConnectedDevices,
  getUserDetails,
  setOptionsForDevice,
  setUserProperty
} from "services/api";

import { newDeviceDataSelector, editDeviceDataSelector, removedDeviceIdSelector } from "./selectors";
import { isCheckoutOverlayOpenSelector } from "apps/admin/store/selectors";
import { upcomingPremiumAcknowledgedProperty } from "apps/admin/store/constants";

export const adminActions = {
  $setDevices: action(devices => ({ devices })),
  $setCalendars: action(calendars => ({ calendars })),
  $setUserDetails: action(user => ({ user })),
  $setUserProperty: action((propertyId, value) => ({ propertyId, value })),
  initialFetch: () => async dispatch => {
    const [calendars, devices, user] = await Promise.all([
      getCalendars(),
      getConnectedDevices(),
      getUserDetails()
    ]);

    dispatch(adminActions.$setCalendars(calendars));
    dispatch(adminActions.$setUserDetails(user));
    dispatch(adminActions.$setDevices(devices));
  }
};

export const connectDeviceWizardActions = {
  show: action(),
  hide: action(),
  firstStep: {
    setConnectionCode: action(connectionCode => ({ connectionCode })),
    $startSubmitting: action(),
    $submitSuccess: action(deviceId => ({ deviceId })),
    $submitError: action(errorMessage => ({ errorMessage })),
    submit: () => async (dispatch, getState) => {
      dispatch(connectDeviceWizardActions.firstStep.$startSubmitting());

      try {
        const { connectionCode } = newDeviceDataSelector(getState());
        const device = await connectDevice(connectionCode);

        dispatch(connectDeviceWizardActions.firstStep.$submitSuccess(device.id));
      } catch (error) {
        const isInvalidConnectionCode = error.response && error.response.status === 404;
        const errorMessage = isInvalidConnectionCode ? "Invalid connection code" : "Unknown error. Please try again later";

        dispatch(connectDeviceWizardActions.firstStep.$submitError(errorMessage));
      }
    }
  },
  secondStep: {
    setDeviceType: action(deviceType => ({ deviceType })),
    nextStep: action()
  },
  thirdStep: {
    setCalendarId: action(calendarId => ({ calendarId })),
    setLanguage: action(language => ({ language })),
    setClockType: action(clockType => ({ clockType })),
    previousStep: action(),
    $startSubmitting: action(),
    submit: () => async (dispatch, getState) => {
      dispatch(connectDeviceWizardActions.thirdStep.$startSubmitting());

      const { deviceId, deviceType, calendarId, language, clockType } = newDeviceDataSelector(getState());
      await setOptionsForDevice(deviceId, deviceType, calendarId, language, 0, clockType);

      dispatch(adminActions.$setDevices(await getConnectedDevices()));
      dispatch(connectDeviceWizardActions.hide());
    }
  }
};

export const editDeviceDialogActions = {
  show: action(device => ({ device })),
  hide: action(),
  setDeviceType: action(deviceType => ({ deviceType })),
  setCalendarId: action(calendarId => ({ calendarId })),
  setLanguage: action(language => ({ language })),
  setClockType: action(clockType => ({ clockType })),
  setMinutesForCheckIn: action(minutesForCheckIn => ({ minutesForCheckIn })),
  $startSubmitting: action(),
  submit: () => async (dispatch, getState) => {
    const { deviceId, deviceType, calendarId, language, minutesForCheckIn, clockType } = editDeviceDataSelector(getState());

    dispatch(editDeviceDialogActions.$startSubmitting());
    await setOptionsForDevice(deviceId, deviceType, calendarId, language, minutesForCheckIn, clockType);

    dispatch(adminActions.$setDevices(await getConnectedDevices()));
    dispatch(editDeviceDialogActions.hide());
  }
};

export const removeDeviceDialogActions = {
  show: action(device => ({ deviceId: device.id })),
  hide: action(),
  submit: () => async (dispatch, getState) => {
    await disconnectDevice(removedDeviceIdSelector(getState()));

    dispatch(adminActions.$setDevices(await getConnectedDevices()));
    dispatch(removeDeviceDialogActions.hide());
  }
};

export const monetizationActions = {
  init: () => () => {
    if (window.Paddle) {
      window.Paddle.Setup({ vendor: 39570 });
    }
  },

  acknowledgeUpcomingPremiumPopup: () => (dispatch) => {
    setUserProperty(upcomingPremiumAcknowledgedProperty, { isAcknowledged: true });
    dispatch(adminActions.$setUserProperty(upcomingPremiumAcknowledgedProperty, true));
  },

  $setIsCheckoutOverlayOpen: action(isCheckoutOverlayOpen => ({ isCheckoutOverlayOpen })),
  $toggleOverlay: isVisible => (dispatch) => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";
    dispatch(monetizationActions.$setIsCheckoutOverlayOpen(isVisible));
  },

  openCheckoutOverlay: productId => (dispatch, getState) => {
    if (isCheckoutOverlayOpenSelector(getState())) {
      return;
    }

    dispatch(monetizationActions.$toggleOverlay(true));

    window.Paddle.Checkout.open({
      product: productId,
      closeCallback: () => dispatch(monetizationActions.$toggleOverlay(false)),
      successCallback: () => dispatch(monetizationActions.$toggleOverlay(false))
    });
  }
};