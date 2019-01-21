import React, { useRef } from "react";
import i18next from "i18next";
import { TableRow, TableRowColumn, Badge } from "theme/index";
import { prettyFormatMinutes, timeDifferenceInMinutes } from "services/formatting";
import { useIsVisible } from "utils/react";

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
  const elRef = useRef();
  const isVisible = useIsVisible(elRef);

  const hasStarted = timestamp > meeting.startTimestamp;

  return (
    <TableRow style={{ visibility: isVisible ? "visible" : "hidden" }}>
      <TableRowColumn style={{ paddingRight: "1em" }} ref={elRef}>{meeting.summary}</TableRowColumn>
      <TableRowColumn>{meeting.calendar.name}</TableRowColumn>
      <TableRowColumn>
        <Badge success={!hasStarted} danger={hasStarted}>{getStatusMessage(meeting, timestamp)}</Badge>
      </TableRowColumn>
    </TableRow>
  );
};