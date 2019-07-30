import { deviceActions, meetingActions } from "apps/device/store/actions";

import { combineReducers } from "redux";
import Moment from "moment";
import { getFontSize, getIsTwoColumnLayout, setFontSize, setIsTwoColumnLayout } from "services/persistent-store";

const timestamp = (state = 0, action) => (action.type === deviceActions.$updateClock ? action.timestamp : state);

const device = (state = null, action) => {
  if (action.type !== deviceActions.$updateDeviceData) return state;

  const getTimestamp = time => time.isTimeZoneFixedToUTC ? Moment.utc(time).valueOf() : Moment(time).valueOf();

  const setEventsTimestamps = calendar => ({
    ...calendar,
    events: calendar.events.map(event => ({
      ...event,
      startTimestamp: getTimestamp(event.start),
      endTimestamp: getTimestamp(event.end)
    }))
  });

  return {
    ...action.device,
    calendar: action.device.calendar && setEventsTimestamps(action.device.calendar),
    allCalendars: action.device.allCalendars && action.device.allCalendars.map(setEventsTimestamps)
  };
};

const defaultCurrentMeetingActionsState = {
  source: null,
  currentAction: null,
  isRetrying: false,
  isError: false,
  errorStatusCode: null,
  isSuccess: false
};

const currentMeetingActions = (state = defaultCurrentMeetingActionsState, action) => {
  switch (action.type) {
    case meetingActions.$setActionSource:
      return { ...state, source: action.source };
    case meetingActions.$startAction:
      return { ...state, currentAction: action.currentAction, isError: false };
    case meetingActions.$setActionIsRetrying:
      return { ...state, isRetrying: true };
    case meetingActions.$setActionError:
      return { ...state, isError: true, errorStatusCode: action.errorStatusCode, isRetrying: false };
    case meetingActions.$setActionSuccess:
      return { ...state, isSuccess: true, isRetrying: false };
    case meetingActions.endAction:
      return defaultCurrentMeetingActionsState;
    default:
      return state;
  }
};

const appState = (state = {
  isSubscriptionCancelled: false,
  isRemoved: false,
  isInitialized: false,
  isOffline: false,
  currentDeviceView: null,
  lastActivityOnShowCalendarsView: null
}, action) => {
  switch (action.type) {
    case deviceActions.$markInitialized:
      return { ...state, isInitialized: true };
    case deviceActions.$markRemoved:
      return { ...state, isRemoved: true };
    case deviceActions.$setIsSubscriptionCancelled:
      return { ...state, isSubscriptionCancelled: action.isSubscriptionCancelled };
    case deviceActions.$updateOfflineStatus:
      return { ...state, isOffline: action.isOffline };
    case deviceActions.$setCurrentDeviceView:
      return { ...state, currentDeviceView: action.currentDeviceView };
    case deviceActions.markDeviceViewActivity:
      return { ...state, lastActivityOnShowCalendarsView: action.timestamp };
    default:
      return state;
  }
};

const displayOptions = (state = {
  isFullScreen: null,
  isSupported: null,
  fontSize: getFontSize(),
  isTwoColumnLayout: getIsTwoColumnLayout()
}, action) => {
  switch (action.type) {
    case deviceActions.$updateFullScreenState:
      return { ...state, isFullScreen: action.isFullScreen, isSupported: action.isSupported };
    case deviceActions.changeFontSize:
      const fontSize = Math.max(state.fontSize + action.fontSizeDelta, 0.1);
      setFontSize(fontSize);
      return { ...state, fontSize };
    case deviceActions.toggleTwoColumnLayout:
      setIsTwoColumnLayout(!state.isTwoColumnLayout);
      return { ...state, isTwoColumnLayout: !state.isTwoColumnLayout };
    default:
      return state;
  }
};

export default combineReducers({
  displayOptions,
  appState,
  timestamp,
  device,
  currentMeetingActions
});
