import ms from "ms";
import React from "react";
import i18next from "i18next";
import { getMeetingSummary, prettyFormatMinutes, timeDifferenceInMinutes } from "services/formatting";
import Status from "dark/Status";
import RowView from "./RowView";
import { Text, Time } from "theme";
import { isAmPmClockSelector, timestampSelector } from "../../store/selectors";
import { connect } from "react-redux";

const t = (key, time) => i18next.t(key, { time: prettyFormatMinutes(time) });

const getStatusMessage = (meeting, timestamp, isAmPmClock) => {
  if (meeting.isAllDayEvent) return t("dashboard.all-day-meeting");

  const minutesToStart = timeDifferenceInMinutes(meeting.startTimestamp, timestamp);
  const minutesToEnd = timeDifferenceInMinutes(meeting.endTimestamp, timestamp);

  if (minutesToStart > 15) {
    return (
      <>
        {i18next.t("dashboard.starts-at")} <Time timestamp={meeting.startTimestamp} ampm={isAmPmClock}/>
      </>
    );
  }

  if (minutesToStart > 0) return t("dashboard.starts-in", Math.ceil(minutesToStart));
  if (minutesToStart > -1) return t("dashboard.starts-now");
  if (minutesToStart > -20) return t("dashboard.started-ago", Math.floor(-minutesToStart));

  return t("dashboard.ends-in", Math.ceil(minutesToEnd));
};

const EventRow = ({ meeting, timestamp, isAmPmClock, fixedHeight }) => {
  const meetingSummary = (
    <>
      {getMeetingSummary(meeting)}
      {meeting && !meeting.isCreatedFromDevice && <Text muted xsmall block>
        {i18next.t("dashboard.hosted-by")} {meeting.organizer.displayName}
      </Text>}
    </>
  );

  const hasStarted = timestamp > meeting.startTimestamp;
  const startsSoon = meeting.startTimestamp - timestamp < ms("5 min");

  const meetingStatus = (
    <Status available={!hasStarted && !startsSoon} warning={!hasStarted && startsSoon} occupied={hasStarted}>
      {getStatusMessage(meeting, timestamp, isAmPmClock)}
    </Status>
  );

  return <RowView meetingRoom={meeting.calendar.name}
                  meetingStatus={meetingStatus}
                  meetingSummary={meetingSummary}
                  fixedHeight={fixedHeight}/>;
};

const mapStateToProps = state => ({
  timestamp: timestampSelector(state),
  isAmPmClock: isAmPmClockSelector(state)
});

export default connect(mapStateToProps)(EventRow);
