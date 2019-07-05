import React from "react";
import { connect } from "react-redux";
import i18next from "i18next";
import styled, { css } from "styled-components/macro";
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
import { displayNameSelector, fontSizeSelector, isTwoColumnLayoutSelector } from "../../store/selectors";

const PageHeader = styled(Section).attrs({ header: true })`
  padding: 0.4rem 0.85rem 0.2rem 0.85rem;
  font-size: 1.4rem;
  color: ${colors.foreground.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const NoMeetingsInfo = styled.div`
  color: white;
  font-size: 1.8em;
  text-align: center;
  margin-top: 35vh;
`;

const ColumnsHeader = styled.div`
  columns: ${props => props.columnsCount};
  column-gap: 0.15rem;
  background: #181818;
  
  ${props => props.columnsCount === 1 && css`
    & > :first-child {
      display: none;
    }
  `}
`;

const ColumnsWrapper = styled.div`
  position: relative;
  flex: 1 1 0;
`;

const Columns = styled.div`
  columns: ${props => props.columnsCount};
  column-rule: 0.15rem dashed #181818;
  column-gap: 0.15rem;
  column-fill: auto;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Dashboard = ({ timestamp, isAmPmClock, displayName, events, calendars, showAvailableRooms, fontSize, isTwoColumnsLayout }) => {
  const hasAnyRows = events.length > 0 || (showAvailableRooms && calendars.length > 0);
  const columnsCount = isTwoColumnsLayout ? 2 : 1;

  return (
    <Layout style={{ overflow: "hidden" }} flexbox fontSize={fontSize}>
      <PageLoaded/>
      <PageHeader>
        <span>{displayName || i18next.t("dashboard.page-title")}</span>
        <span>
          <Time timestamp={timestamp} ampm={isAmPmClock} smallSuffix blinking/>
        </span>
      </PageHeader>

      {hasAnyRows && <ColumnsHeader columnsCount={columnsCount}>
        <RowView
          header
          meetingSummary={i18next.t("dashboard.meeting")}
          meetingStatus={i18next.t("dashboard.status")}
          meetingRoom={i18next.t("dashboard.calendar")}
        />
        <RowView
          header
          meetingSummary={i18next.t("dashboard.meeting")}
          meetingStatus={i18next.t("dashboard.status")}
          meetingRoom={i18next.t("dashboard.calendar")}
        />
      </ColumnsHeader>}

      <ColumnsWrapper>
        {!hasAnyRows && <NoMeetingsInfo>{i18next.t("dashboard.no-meetings")}</NoMeetingsInfo>}
        {hasAnyRows && <Columns columnsCount={columnsCount}>
          {showAvailableRooms && calendars.map((calendar, index) => <CalendarRow key={index}
                                                                                 calendarId={calendar.id}/>)}
          {events.map((event, index) => <EventRow key={index} meeting={event}/>)}
          {Array(1000).fill(1).map(() => <div style={{ visibility: "hidden" }}>&nbsp;</div>)}
        </Columns>}
      </ColumnsWrapper>
    </Layout>
  );
};

const mapStateToProps = state => ({
  timestamp: timestampSelector(state),
  displayName: displayNameSelector(state),
  calendars: allCalendarsSelector(state),
  events: dashboardMeetingsSelector(state),
  isAmPmClock: isAmPmClockSelector(state),
  showAvailableRooms: showAvailableRoomsSelector(state),
  fontSize: fontSizeSelector(state),
  isTwoColumnsLayout: isTwoColumnLayoutSelector(state)
});

export default connect(mapStateToProps)(Dashboard);
