import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import MdLayers from "react-icons/lib/md/layers";

import {
  calendarNameSelector,
  currentMeetingSelector,
  isAmPmClockSelector,
  nextMeetingSelector
} from "../../store/selectors";

import NextMeeting from "./NextMeeting";
import { deviceActions } from "apps/device/store/actions";
import colors from "dark/colors";
import { PageLoaded } from "theme";
import Time from "theme/components/Time";
import RoomStatus from "apps/device/views/single-calendar/RoomStatus";
import Partial from "dark/Partial";
import CurrentMeeting from "apps/device/views/single-calendar/CurrentMeeting";
import ActionsBar from "apps/device/views/single-calendar/actions-bar";
import Button from "dark/Button";
import Layout from "dark/Layout";
import FullScreenToggle from "apps/device/components/FullScreenToggle";

const Header = styled.div`
  background: ${colors.background.black};
  color: ${colors.foreground.white};
  padding: .9em 1.2em .4em 1.2em;
  display: flex;
  justify-content: space-between;
`;

const CalendarName = styled.span`
  font-size: 1.5em;
`;

const TimeWrapper = styled.div`
  font-size: 3em;
  margin-top: -0.1em;
`;

const StatusBar = styled(Partial)`
  display: flex;
  justify-content: space-between;
  padding: 0.6em 1.2em;
  color: ${colors.foreground.white};
  align-items: center;
`;

const ActionsWrapper = styled.div`
  padding: 0.6em 1.2em;
`;

const CalendarView = ({ calendarName, style, nextMeeting, currentMeeting, showAllCalendarsView, currentTimestamp, isAmPmClock }) => (
  <Layout>
    <PageLoaded/>
    <Header>
      <CalendarName>
        {calendarName}
      </CalendarName>
      <TimeWrapper>
        <Time timestamp={currentTimestamp} ampm={isAmPmClock} blinking suffixStyle={{ fontSize: "0.5em" }}/>
      </TimeWrapper>
    </Header>

    <StatusBar>
      <RoomStatus/>
      <Button subtle style={{ padding: "0.5em 1em" }} onClick={showAllCalendarsView}>Find Room <MdLayers/></Button>
    </StatusBar>

    <CurrentMeeting/>

    <ActionsWrapper>
      <ActionsBar/>
    </ActionsWrapper>

    <div style={{ flexGrow: 1 }}/>

    {nextMeeting && <NextMeeting/>}

    <FullScreenToggle/>
  </Layout>
);

const mapStateToProps = state => ({
  calendarName: calendarNameSelector(state),
  currentMeeting: currentMeetingSelector(state),
  nextMeeting: nextMeetingSelector(state),
  currentTimestamp: state.timestamp,
  isAmPmClock: isAmPmClockSelector(state)
});

const mapDispatchToProps = dispatch => ({
  showAllCalendarsView: () => dispatch(deviceActions.showAllCalendarsView())
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarView);
