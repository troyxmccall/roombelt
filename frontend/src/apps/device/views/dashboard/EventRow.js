import ms from "ms";
import React from "react";
import i18next from "i18next";
import { getMeetingSummary, prettyFormatMinutes, timeDifferenceInMinutes } from "services/formatting";
import DateRange from "react-icons/lib/md/date-range";
import Status from "dark/Status";
import RowView from "./RowView";

const t = (key, time) => i18next.t(key, { time: prettyFormatMinutes(time) });

const getStatusMessage = (meeting, timestamp) => {
  if (meeting.isAllDayEvent) return t("dashboard.all-day-meeting");

  const minutesToStart = timeDifferenceInMinutes(meeting.startTimestamp, timestamp);
  const minutesToEnd = timeDifferenceInMinutes(meeting.endTimestamp, timestamp);

  if (minutesToStart > 0) return t("dashboard.starts-in", Math.ceil(minutesToStart));
  if (minutesToStart > -1) return t("dashboard.starts-now");
  if (minutesToStart > -20) return t("dashboard.started-ago", Math.floor(-minutesToStart));

  return t("dashboard.ends-in", Math.ceil(minutesToEnd));
};

export default ({ meeting, timestamp }) => {
  const meetingSummary = (
    <>
      <DateRange style={{ verticalAlign: "middle" }}/>
      <span style={{ verticalAlign: "middle", marginLeft: ".5em" }}>{getMeetingSummary(meeting)}</span>
    </>
  );

  const hasStarted = timestamp > meeting.startTimestamp;
  const startsSoon = meeting.startTimestamp - timestamp < ms("5 min");

  const meetingStatus = (
    <Status available={!hasStarted && !startsSoon}
            warning={!hasStarted && startsSoon}
            occupied={hasStarted}>{getStatusMessage(meeting, timestamp)}</Status>
  );

  return <RowView meetingRoom={meeting.calendar.name}
                  meetingStatus={meetingStatus}
                  meetingSummary={meetingSummary}/>;
};