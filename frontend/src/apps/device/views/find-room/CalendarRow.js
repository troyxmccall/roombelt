import React from "react";
import i18next from "i18next";
import styled from "styled-components/macro";
import { connect } from "react-redux";
import {
  calendarNameSelector,
  currentActionSourceSelector,
  currentMeetingSelector,
  isActionErrorSelector,
  isActionSuccessSelector,
  isAmPmClockSelector,
  isRetryingActionSelector,
  nextMeetingSelector,
  timestampSelector
} from "apps/device/store/selectors";
import { prettyFormatMinutes, timeDifferenceInMinutes } from "services/formatting";
import { Time } from "theme";
import { deviceActions, meetingActions } from "apps/device/store/actions";
import ActionError from "../../components/ActionError";
import Section from "dark/Section";
import LoaderButton from "dark/LoaderButton";
import Button from "dark/Button";
import Status from "dark/Status";
import colors from "dark/colors";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RowContent = styled.div`
  margin: 0 1.2em 1em 1.2em;
  background: #424242;
  padding: 0.6em 1em;
  color: ${colors.foreground.white}
`;

const getAvailability = (isAllDayMeeting, timeToStart, minutesAvailable) => {
  if (isAllDayMeeting) {
    return <Status occupied>{i18next.t("availability.occupied-all-day")}</Status>;
  }

  if (timeToStart >= 15 || minutesAvailable < 5) {
    return <Status occupied>{i18next.t("availability.occupied")}</Status>;
  }
  if (timeToStart >= 1) {
    return <Status
      warning>{i18next.t("availability.available-in", { time: prettyFormatMinutes(Math.ceil(timeToStart)) })}</Status>;
  }

  return <Status available>{i18next.t("availability.available")}</Status>;
};


const CalendarRow = ({ isFirst, calendarId, calendarName, currentMeeting, nextMeeting, timestamp, currentActionSource, isCurrentActionSuccess, isCurrentActionError, isRetryingAction, createMeeting, acknowledgeMeetingCreated, isAmPmClock }) => {
  const startTimestamp = currentMeeting ? currentMeeting.endTimestamp : timestamp;
  const endTimestamp = nextMeeting ? nextMeeting.startTimestamp : Number.POSITIVE_INFINITY;

  const timeToStart = timeDifferenceInMinutes(startTimestamp, timestamp);
  const minutesAvailable = timeDifferenceInMinutes(endTimestamp, startTimestamp);

  const isAvailable = timeToStart <= 0 && minutesAvailable > 5;

  const isCurrentActionFromThisCalendar = currentActionSource && currentActionSource.indexOf(calendarId) === 0;

  const showError = isCurrentActionFromThisCalendar && isCurrentActionError;
  const showSuccessInfo = isCurrentActionFromThisCalendar && isCurrentActionSuccess;
  const showMeetingDetails = !isAvailable && !showSuccessInfo && !showError;
  const showButtons = isAvailable && !showSuccessInfo && !showError;

  const header = (
    <Header>
      <span style={{ fontSize: "1.2em" }}>{calendarName}</span>
      {getAvailability(currentMeeting && currentMeeting.isAllDayEvent, timeToStart, minutesAvailable)}
    </Header>
  );

  const CreateButton = ({ value, name }) => (
    <LoaderButton
      disabled={currentActionSource !== null}
      isLoading={currentActionSource === name}
      onClick={() => createMeeting(calendarId, value, name)}
      children={prettyFormatMinutes(Math.ceil(value))}
    />
  );

  return (
    <Section partial={isFirst}>
      <RowContent>
        {header}
        <div style={{ fontSize: "0.8em", marginTop: "0.5em", lineHeight: "1.2em", minHeight: "1.2em" }}>
          {showMeetingDetails && <>
            {currentMeeting.summary}{" "}
            {currentMeeting && !currentMeeting.isAllDayEvent && <>
              <Time timestamp={currentMeeting.startTimestamp} ampm={isAmPmClock}/>
              {" - "}
              <Time timestamp={currentMeeting.endTimestamp} ampm={isAmPmClock}/>
            </>}
          </>}
          {showSuccessInfo && <>
            <span style={{ marginRight: "1em" }}>{i18next.t("meeting-created")}</span>
            <Button primary onClick={acknowledgeMeetingCreated}>OK</Button>
          </>}
          {showError && <ActionError/>}
          {showButtons && <>
            <Button disabled success>Start</Button>
            {minutesAvailable > 20 && <CreateButton value={15} name={`${calendarId}-create-15`}/>}
            {minutesAvailable > 40 && <CreateButton value={30} name={`${calendarId}-create-30`}/>}
            {minutesAvailable > 70 && <CreateButton value={60} name={`${calendarId}-create-60`}/>}
            {minutesAvailable > 130 && <CreateButton value={120} name={`${calendarId}-create-120`}/>}
            {minutesAvailable <= 130 && <CreateButton value={minutesAvailable} name={`${calendarId}-create-custom`}/>}
          </>}
        </div>
      </RowContent>
    </Section>
  );
};

const mapStateToProps = (state, { calendarId }) => ({
  timestamp: timestampSelector(state),
  calendarName: calendarNameSelector(state, { calendarId }),
  currentMeeting: currentMeetingSelector(state, { calendarId }),
  nextMeeting: nextMeetingSelector(state, { calendarId }),
  isRetryingAction: isRetryingActionSelector(state),
  isCurrentActionError: isActionErrorSelector(state),
  isCurrentActionSuccess: isActionSuccessSelector(state),
  currentActionSource: currentActionSourceSelector(state),
  isAmPmClock: isAmPmClockSelector(state)
});

const mapDispatchToProps = (dispatch) => ({
  createMeeting: (calendarId, minutes, source) => {
    dispatch(deviceActions.$allCalendarsViewActivity());
    dispatch(meetingActions.createMeetingInAnotherRoom(calendarId, minutes));
    dispatch(meetingActions.$setActionSource(source));
  },
  acknowledgeMeetingCreated: () => {
    dispatch(deviceActions.$allCalendarsViewActivity());
    dispatch(meetingActions.endAction());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarRow);