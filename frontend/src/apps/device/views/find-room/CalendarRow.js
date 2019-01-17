import React from "react";
import i18next from "i18next";
import styled from "styled-components/macro";
import { connect } from "react-redux";
import {
  calendarNameSelector, currentActionSourceSelector,
  currentMeetingSelector, isActionErrorSelector, isActionSuccessSelector, isAmPmClockSelector, isRetryingActionSelector,
  nextMeetingSelector, timestampSelector
} from "apps/device/store/selectors";
import { prettyFormatMinutes, timeDifferenceInMinutes } from "services/formatting";
import { Card, Badge, Button, LoaderButton, Text, Time } from "theme";
import ButtonSet from "../../components/ButtonSet";
import { deviceActions, meetingActions } from "apps/device/store/actions";
import ActionError from "../../components/ActionError";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Row = styled(Card)`
  margin-top: 1em;
  
  &:last-child {
    margin-bottom: 1em;
  }
`;

const getAvailability = (timeToStart, minutesAvailable) => {
  if (timeToStart >= 15 || minutesAvailable < 5) {
    return <Badge danger>{i18next.t("availability.occupied")}</Badge>;
  }
  if (timeToStart >= 1) {
    return <Badge
      warning>{i18next.t("availability.available-in", { time: prettyFormatMinutes(Math.ceil(timeToStart)) })}</Badge>;
  }

  return <Badge success>{i18next.t("availability.available")}</Badge>;
};


const CalendarRow = ({ calendarId, calendarName, currentMeeting, nextMeeting, timestamp, currentActionSource, isCurrentActionSuccess, isCurrentActionError, isRetryingAction, createMeeting, acknowledgeMeetingCreated, isAmPmClock }) => {
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
      {calendarName}
      {getAvailability(timeToStart, minutesAvailable)}
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
    <Row block>
      {header}
      {showMeetingDetails && <Text style={{ fontSize: "0.8em" }}>
        {currentMeeting.summary}{" "}
        <Time timestamp={currentMeeting.startTimestamp} ampm={isAmPmClock}/>
        {" - "}
        <Time timestamp={currentMeeting.endTimestamp} ampm={isAmPmClock}/>
      </Text>}
      {showSuccessInfo && <>
        <Text style={{ marginRight: "1em", fontSize: "0.8em" }}>{i18next.t("meeting-created")}</Text>
        <ButtonSet style={{ fontSize: "0.6em" }}>
          <Button primary onClick={acknowledgeMeetingCreated}>OK</Button>
        </ButtonSet>
      </>}
      {showError && <ActionError style={{ fontSize: "0.6em" }}/>}
      {showButtons && <ButtonSet style={{ fontSize: "0.6em" }}>
        <Button disabled success>Start</Button>
        {minutesAvailable > 20 && <CreateButton value={15} name={`${calendarId}-create-15`}/>}
        {minutesAvailable > 40 && <CreateButton value={30} name={`${calendarId}-create-30`}/>}
        {minutesAvailable > 70 && <CreateButton value={60} name={`${calendarId}-create-60`}/>}
        {minutesAvailable > 130 && <CreateButton value={120} name={`${calendarId}-create-120`}/>}
        {minutesAvailable <= 130 && <CreateButton value={minutesAvailable} name={`${calendarId}-create-custom`}/>}
      </ButtonSet>}
    </Row>
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