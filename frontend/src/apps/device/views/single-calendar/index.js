import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import MdLayers from "react-icons/lib/md/search";
import MdToday from "react-icons/lib/md/today";

import {
  calendarNameSelector,
  currentMeetingSelector,
  fontSizeSelector,
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
import i18next from "i18next";

const Header = styled.div`
  background: ${colors.background.black};
  color: ${colors.foreground.white};
  padding: 0.9rem 1.2rem 0.4rem 1.2rem;
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

const StatusBar = styled(Partial).attrs({ split: "2.5rem" })`
  display: flex;
  padding: 0.6rem 1.2rem;
  color: ${colors.foreground.white};
  align-items: center;

  @media screen and (orientation: portrait) {
    flex-direction: column;
    align-items: stretch;
    padding-bottom: 0.2rem;
  }
`;

const ButtonsWrapper = styled.div`
  @media screen and (orientation: portrait) {
    padding-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    margin-left: -0.3rem;
  }
`;

const ActionsWrapper = styled.div`
  padding: 0.6rem 1.2rem 0 1.2rem;
  button {
    margin-bottom: 0.6rem;
  }
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const CalendarView = ({
  calendarName,
  style,
  nextMeeting,
  currentMeeting,
  showAllCalendarsView,
  showTodayScheduleView,
  currentTimestamp,
  isAmPmClock,
  fontSize
}) => (
  <Layout flexbox fontSize={fontSize}>
    <PageLoaded />
    <Header>
      <CalendarName>{calendarName}</CalendarName>
      <TimeWrapper>
        <Time timestamp={currentTimestamp} ampm={isAmPmClock} blinking smallSuffix />
      </TimeWrapper>
    </Header>

    <StatusBar>
      <RoomStatus />
      <Spacer />
      <ButtonsWrapper>
        <Button subtle style={{ padding: "0.5rem" }} onClick={showTodayScheduleView}>
          {i18next.t("actions.calendar-view")} <MdToday />
        </Button>
        <Button subtle style={{ padding: "0.5rem", margin: "0 -0.5rem 0 0" }} onClick={showAllCalendarsView}>
          {i18next.t("actions.find-room")} <MdLayers />
        </Button>
      </ButtonsWrapper>
    </StatusBar>

    <CurrentMeeting />

    <ActionsWrapper>
      <ActionsBar />
    </ActionsWrapper>

    <Spacer />

    {nextMeeting && <NextMeeting />}
  </Layout>
);

const mapStateToProps = state => ({
  calendarName: calendarNameSelector(state),
  currentMeeting: currentMeetingSelector(state),
  nextMeeting: nextMeetingSelector(state),
  currentTimestamp: state.timestamp,
  isAmPmClock: isAmPmClockSelector(state),
  fontSize: fontSizeSelector(state)
});

const mapDispatchToProps = {
  showAllCalendarsView: deviceActions.showAllCalendarsView,
  showTodayScheduleView: deviceActions.showTodayScheduleView
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarView);
