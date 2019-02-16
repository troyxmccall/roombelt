import { combineReducers } from "redux";

import {
  adminActions,
  editDeviceDialogActions,
  connectDeviceWizardActions,
  removeDeviceDialogActions, monetizationActions
} from "apps/admin/store/actions";

const user = (state = { displayName: "", avatarUrl: undefined }, action) => {
  switch (action.type) {
    case adminActions.$setUserDetails:
      return { displayName: action.user.displayName, avatarUrl: action.user.avatarUrl };
    default:
      return state;
  }
};

const devices = (state = { isLoaded: false, data: [] }, action) => {
  switch (action.type) {
    case adminActions.$setDevices:
      return { isLoaded: true, data: action.devices };
    default:
      return state;
  }
};

const calendars = (state = {}, action) => {
  switch (action.type) {
    case adminActions.$setCalendars:
      return action.calendars.reduce((acc, calendar) => ({ ...acc, [calendar.id]: calendar }), {});
    default:
      return state;
  }
};

const editedDevice = (state = { data: null, isSaving: false }, action) => {
  switch (action.type) {
    case editDeviceDialogActions.show:
      return { data: JSON.parse(JSON.stringify(action.device)) };
    case editDeviceDialogActions.hide:
      return { data: null };
    case editDeviceDialogActions.$startSubmitting:
      return { data: state.data, isSaving: true };
    case editDeviceDialogActions.setDeviceType:
      return { data: { ...state.data, deviceType: action.deviceType } };
    case editDeviceDialogActions.setCalendarId:
      return { data: { ...state.data, calendarId: action.calendarId } };
    case editDeviceDialogActions.setLanguage:
      return { data: { ...state.data, language: action.language } };
    case editDeviceDialogActions.setClockType:
      return { data: { ...state.data, clockType: action.clockType } };
    case editDeviceDialogActions.setMinutesForCheckIn:
      return { data: { ...state.data, minutesForCheckIn: action.minutesForCheckIn } };
    default:
      return state;
  }
};

const removedDevice = (state = null, action) => {
  switch (action.type) {
    case removeDeviceDialogActions.show:
      return action.deviceId;
    case removeDeviceDialogActions.hide:
      return null;
    default:
      return state;
  }
};

const defaultConnectDeviceWizardState = {
  currentStep: null,
  connectionCode: "",
  deviceId: null,
  deviceType: "calendar",
  calendarId: null,
  language: "en-US",
  clockType: 12,
  minutesForCheckIn: 0,
  errorMessage: null,
  isSubmitting: false
};

const connectDeviceWizard = (state = defaultConnectDeviceWizardState, action) => {
  switch (action.type) {
    case connectDeviceWizardActions.show:
      return { ...defaultConnectDeviceWizardState, currentStep: "connection-code" };
    case connectDeviceWizardActions.hide:
      return defaultConnectDeviceWizardState;
    case connectDeviceWizardActions.firstStep.setConnectionCode:
      return { ...state, connectionCode: action.connectionCode.replace(/\D/g, "") };
    case connectDeviceWizardActions.firstStep.$startSubmitting:
      return { ...state, errorMessage: null, isSubmitting: true };
    case connectDeviceWizardActions.firstStep.$submitSuccess:
      return { ...state, currentStep: "device-type", isSubmitting: false, deviceId: action.deviceId };
    case connectDeviceWizardActions.firstStep.$submitError:
      return { ...state, errorMessage: action.errorMessage, isSubmitting: false };
    case connectDeviceWizardActions.secondStep.setDeviceType:
      return { ...state, deviceType: action.deviceType };
    case connectDeviceWizardActions.secondStep.nextStep:
      return { ...state, currentStep: "configuration" };
    case connectDeviceWizardActions.thirdStep.previousStep:
      return { ...state, currentStep: "device-type" };
    case connectDeviceWizardActions.thirdStep.setCalendarId:
      return { ...state, calendarId: action.calendarId };
    case connectDeviceWizardActions.thirdStep.setLanguage:
      return { ...state, language: action.language };
    case connectDeviceWizardActions.thirdStep.setClockType:
      return { ...state, clockType: action.clockType };
    case connectDeviceWizardActions.thirdStep.$startSubmitting:
      return { ...state, errorMessage: null, isSubmitting: true };
    default:
      return state;
  }
};

const monetization = (state = { currentPlan: null, isCheckoutOverlayOpen: false }, action) => {
  switch (action) {
    case monetizationActions.$setIsCheckoutOverlayOpen:
      return { ...state, isCheckoutOverlayOpen: action.isCheckoutOverlayOpen };
    default:
      return state;
  }
};

export default combineReducers({
  user,
  devices,
  calendars,
  editedDevice,
  removedDevice,
  connectDeviceWizard,
  monetization
});
