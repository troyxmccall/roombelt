import { createSelector } from "reselect";
import { timeDifferenceInMinutes } from "../../../services/formatting";

export const isDeviceRemovedSelector = state => state.appState.isRemoved;
export const isInitializedSelector = state => state.appState.isInitialized;
export const timestampSelector = state => state.timestamp;
export const deviceSelector = state => state.device;
export const isInOfflineModeSelector = state => state.appState.isOffline;
export const showAllCalendarsViewSelector = state => state.appState.showAllCalendarsView;
export const lastActivityOnShowCalendarsViewSelector = state => state.appState.lastActivityOnShowCalendarsView;
export const connectionCodeSelector = state => state.device && state.device.connectionCode;
export const currentActionSelector = state => state.currentMeetingActions.currentAction;
export const currentActionSourceSelector = state => state.currentMeetingActions.source;
export const isActionErrorSelector = state => state.currentMeetingActions.isError;
export const isActionSuccessSelector = state => state.currentMeetingActions.isSuccess;
export const isRetryingActionSelector = state => state.currentMeetingActions.isRetrying;

export const calendarSelector = (state, props) => {
  if (!props || !props.calendarId) {
    return state.device.calendar;
  }

  return state.device.allCalendars.find(calendar => calendar.id === props.calendarId);
};

export const isDeviceConnectedSelector = createSelector(deviceSelector, device => device && !device.connectionCode);
export const isDashboardDeviceSelector = createSelector(deviceSelector, device => device && device.deviceType === "dashboard");
export const isCalendarSelectedSelector = createSelector(deviceSelector, device => device && !!device.calendar);
export const isAmPmClockSelector = createSelector(deviceSelector, device => device ? device.clockType === 12 : true);

export const allCalendarsSelector = createSelector(deviceSelector, device => (device && device.allCalendars) || []);
export const areAllCalendarsLoadedSelector = createSelector(deviceSelector, device => device && !!device.allCalendars);

export const requireCheckInSelector = createSelector(deviceSelector, device => device && device.minutesForCheckIn > 0);
export const minutesForCheckInSelector = createSelector(deviceSelector, device => device && device.minutesForCheckIn);
export const calendarNameSelector = createSelector(calendarSelector, calendar => calendar && calendar.name);

export const currentMeetingSelector = createSelector([calendarSelector, timestampSelector],
  (calendar, currentTimestamp) => calendar && calendar.events.find(
    event => event.startTimestamp < currentTimestamp + 5 * 60 * 1000 && event.endTimestamp > currentTimestamp
  ));

export const nextMeetingSelector = createSelector(
  [calendarSelector, timestampSelector, currentMeetingSelector],
  (calendar, currentTimestamp, currentMeeting) =>
    calendar.events.find(event => {
      const isToday = new Date(event.startTimestamp).toDateString() === new Date(currentTimestamp).toDateString();
      const isLater = event.startTimestamp > currentTimestamp;
      const isNotCurrentMeeting = !currentMeeting || event.id !== currentMeeting.id;
      return isToday && isLater && isNotCurrentMeeting;
    })
);

export const minutesAvailableTillNextMeetingSelector = createSelector(
  [timestampSelector, currentMeetingSelector, nextMeetingSelector],
  (currentTimestamp, currentMeeting, nextMeeting) => {
    return Math.ceil(timeDifferenceInMinutes(
      nextMeeting && nextMeeting.startTimestamp,
      currentMeeting ? currentMeeting.endTimestamp : currentTimestamp
    ));
  }
);

export const isAfterCurrentMeetingStartTimeSelector = createSelector(
  [timestampSelector, currentMeetingSelector],
  (currentTimestamp, currentMeeting) => currentTimestamp > currentMeeting.startTimestamp
);

export const dashBoardMeetingsSelector = createSelector(
  [timestampSelector, allCalendarsSelector],
  (currentTimestamp, allCalendars) => {
    const eventsByCalendars = allCalendars.map(calendar => calendar.events.map(event => ({ ...event, calendar })));
    const allEvents = [].concat(...eventsByCalendars);

    return allEvents
      .filter(event => event.startTimestamp > currentTimestamp || event.endTimestamp > currentTimestamp)
      .filter(event => new Date(event.startTimestamp).toDateString() === new Date(currentTimestamp).toDateString())
      .sort((eventA, eventB) => eventA.startTimestamp - eventB.startTimestamp);
  }
);