import ms from "ms";
import React from "react";
import Status from "dark/Status";
import RowView from "./RowView";
import {
  calendarNameSelector,
  currentMeetingSelector,
  nextMeetingSelector,
  timestampSelector
} from "apps/device/store/selectors";
import { connect } from "react-redux";
import { prettyFormatMinutes, timeDifferenceInMinutes } from "services/formatting";
import * as i18next from "i18next";

const CalendarRow = ({ calendarName, timestamp, currentMeeting, nextMeeting, fixedHeight }) => {
  if (currentMeeting) {
    return null;
  }

  if (nextMeeting && nextMeeting.startTimestamp - timestamp < ms("15 min")) {
    return null;
  }

  const status = nextMeeting ?
    i18next.t("availability.available-for", { time: prettyFormatMinutes(Math.ceil(timeDifferenceInMinutes(nextMeeting.startTimestamp, timestamp))) }) :
    i18next.t("availability.available-all-day");

  return <RowView meetingRoom={calendarName}
                  meetingStatus={<Status available={true}>{status}</Status>}
                  meetingSummary={<>&nbsp;–</>}
                  fixedHeight={fixedHeight}/>;
};

const mapStateToProps = (state, { calendarId }) => ({
  timestamp: timestampSelector(state),
  calendarName: calendarNameSelector(state, { calendarId }),
  currentMeeting: currentMeetingSelector(state, { calendarId }),
  nextMeeting: nextMeetingSelector(state, { calendarId })
});

export default connect(mapStateToProps)(CalendarRow);