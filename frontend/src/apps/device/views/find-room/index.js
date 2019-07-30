import React from "react";
import { connect } from "react-redux";
import i18next from "i18next";
import { allCalendarsSelector, areAllCalendarsLoadedSelector } from "apps/device/store/selectors";

import CalendarRow from "./CalendarRow";
import PageLayout from "dark/PageLayout";

const AllCalendarsView = ({ setMainDeviceView, calendars, areAllCalendarsLoaded, markUserActivity }) => {
  return (
    <PageLayout isLoaded={areAllCalendarsLoaded} title={i18next.t("actions.find-room")}>
      {calendars.map(calendar => <CalendarRow key={calendar.id} calendarId={calendar.id}/>)}
    </PageLayout>
  );
};

const mapStateToProps = state => ({
  areAllCalendarsLoaded: areAllCalendarsLoadedSelector(state),
  calendars: allCalendarsSelector(state)
});

export default connect(mapStateToProps)(AllCalendarsView);