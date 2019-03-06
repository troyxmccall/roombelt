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
import i18next from "i18next";

const Header = styled.div`
  background: ${colors.background.black};
  color: ${colors.foreground.white};
  padding: .9rem 1.2rem .4rem 1.2rem;
  display: flex;
  justify-content: space-between;
`;

const CalendarName = styled.span`
  font-size: 1.5rem;
`;

const TimeWrapper = styled.div`
  font-size: 3rem;
  margin-top: -0.1rem;
`;

const StatusBar = styled(Partial)`
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 1.2rem;
  color: ${colors.foreground.white};
  align-items: center;
`;

const ActionsWrapper = styled.div`
  padding: 0.6rem 1.2rem;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const CalendarView = ({ calendarName, style, nextMeeting, currentMeeting, showAllCalendarsView, currentTimestamp, isAmPmClock }) => (
  <Layout>
    <PageLoaded/>
    <Header>
      <CalendarName>
        {calendarName}
      </CalendarName>
      <TimeWrapper>
        <Time timestamp={currentTimestamp} ampm={isAmPmClock} blinking smallSuffix/>
      </TimeWrapper>
    </Header>

    <StatusBar>
      <RoomStatus/>
      <Button subtle style={{ padding: "0.5rem", margin: "0 -0.5rem 0 0" }} onClick={showAllCalendarsView}>
        {i18next.t("actions.find-room")} <MdLayers/>
      </Button>
    </StatusBar>

    <CurrentMeeting/>

    <ActionsWrapper>
      <ActionsBar/>
    </ActionsWrapper>

    <Spacer/>

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
