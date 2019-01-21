import React from "react";
import i18next from "i18next";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { calendarNameSelector, currentMeetingSelector, nextMeetingSelector } from "../../store/selectors";

import NextMeeting from "./NextMeeting";
import CurrentMeeting from "./CurrentMeeting";
import RoomAvailable from "./RoomAvailable";
import ActionsBar from "./actions-bar/index";
import Layout, { SidebarButton } from "../../components/Layout";
import { deviceActions } from "apps/device/store/actions";

const ActionsBarWrapper = styled.div`
  margin: 1rem 0;
  height: 3rem;
`;

const Content = styled.div`
  padding: 0.5em;
`;

const CalendarView = ({ calendarName, style, nextMeeting, currentMeeting, showAllCalendarsView }) => (
  <Layout title={calendarName} style={style} footer={nextMeeting && <NextMeeting/>}
          sidebar={<SidebarButton onClick={showAllCalendarsView} info>{i18next.t("actions.find-room")}</SidebarButton>}>
    <Content>
      {currentMeeting ? <CurrentMeeting/> : <RoomAvailable/>}
      {(!currentMeeting || !currentMeeting.isAllDayEvent) && <ActionsBarWrapper><ActionsBar/></ActionsBarWrapper>}
    </Content>
  </Layout>
);

const mapStateToProps = state => ({
  calendarName: calendarNameSelector(state),
  currentMeeting: currentMeetingSelector(state),
  nextMeeting: nextMeetingSelector(state)
});

const mapDispatchToProps = dispatch => ({
  showAllCalendarsView: () => dispatch(deviceActions.showAllCalendarsView())
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarView);
