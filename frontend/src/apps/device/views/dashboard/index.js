import React from "react";
import { connect } from "react-redux";
import i18next from "i18next";
import styled from "styled-components/macro";
import {
  allCalendarsSelector,
  dashboardMeetingsSelector,
  isAmPmClockSelector, showAvailableRoomsSelector,
  timestampSelector
} from "apps/device/store/selectors";
import EventRow from "./EventRow";
import { PageLoaded } from "theme";

import Layout from "dark/Layout";
import Section from "dark/Section";
import colors from "dark/colors";
import Time from "theme/components/Time";
import FullScreenToggle from "apps/device/components/FullScreenToggle";
import RowView from "./RowView";
import CalendarRow from "./CalendarRow";

const Header = styled(Section).attrs({ header: true })`
  padding: 0.4rem 0.85rem 0.2rem 0.85rem;
  font-size: 1.4rem;
  color: ${colors.foreground.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const DashboardWrapper = styled.div`
  flex-grow: 1;
  font-size: 0.8rem;
  overflow: hidden;
`;

const Dashboard = ({ timestamp, isAmPmClock, events, calendars, showAvailableRooms }) => <Layout>
    <PageLoaded/>
    <Header>
      <span>{i18next.t("dashboard.page-title")}</span>
      <span><Time timestamp={timestamp} ampm={isAmPmClock} smallSuffix blinking/></span>
    </Header>

    <RowView style={{ fontSize: "0.6rem", paddingBottom: 0 }}
             header
             meetingSummary={i18next.t("dashboard.meeting")}
             meetingStatus={i18next.t("dashboard.status")}
             meetingRoom={i18next.t("dashboard.calendar")}/>

    <DashboardWrapper>
      {showAvailableRooms && calendars.map(calendar => <CalendarRow key={calendar.id} calendarId={calendar.id}/>)}
      {events.map(event => <EventRow key={event.id} meeting={event} timestamp={timestamp}/>)}
    </DashboardWrapper>
    <FullScreenToggle/>
  </Layout>
;

const mapStateToProps = state => ({
  timestamp: timestampSelector(state),
  calendars: allCalendarsSelector(state),
  events: dashboardMeetingsSelector(state),
  isAmPmClock: isAmPmClockSelector(state),
  showAvailableRooms: showAvailableRoomsSelector(state)
});

export default connect(mapStateToProps)(Dashboard);