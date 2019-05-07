import React from "react";
import { connect } from "react-redux";
import i18next from "i18next";
import styled from "styled-components/macro";
import {
  allCalendarsSelector,
  dashboardMeetingsSelector,
  isAmPmClockSelector,
  showAvailableRoomsSelector,
  timestampSelector
} from "apps/device/store/selectors";
import EventRow from "./EventRow";
import { PageLoaded } from "theme";

import Layout from "dark/Layout";
import Section from "dark/Section";
import colors from "dark/colors";
import Time from "theme/components/Time";
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

const NoMeetingsInfo = styled.div`
  color: white;
  font-size: 1.8em;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dashboard = ({ timestamp, isAmPmClock, events, calendars, showAvailableRooms }) => {
  const hasAnyRows = events.length > 0 || (showAvailableRooms && calendars.length > 0);

  return (
    <Layout>
      <PageLoaded />
      <Header>
        <span>{i18next.t("dashboard.page-title")}</span>
        <span>
          <Time timestamp={timestamp} ampm={isAmPmClock} smallSuffix blinking />
        </span>
      </Header>

      {hasAnyRows && (
        <RowView
          style={{ fontSize: "0.6rem", paddingBottom: 0 }}
          header
          meetingSummary={i18next.t("dashboard.meeting")}
          meetingStatus={i18next.t("dashboard.status")}
          meetingRoom={i18next.t("dashboard.calendar")}
        />
      )}

      <DashboardWrapper>
        {showAvailableRooms && calendars.map(calendar => <CalendarRow key={calendar.id} calendarId={calendar.id} />)}
        {events.map(event => <EventRow key={event.id} meeting={event} />)}
        {!hasAnyRows && <NoMeetingsInfo>{i18next.t("dashboard.no-meetings")}</NoMeetingsInfo>}
      </DashboardWrapper>
    </Layout>
  );
};

const mapStateToProps = state => ({
  timestamp: timestampSelector(state),
  calendars: allCalendarsSelector(state),
  events: dashboardMeetingsSelector(state),
  isAmPmClock: isAmPmClockSelector(state),
  showAvailableRooms: showAvailableRoomsSelector(state)
});

export default connect(mapStateToProps)(Dashboard);
