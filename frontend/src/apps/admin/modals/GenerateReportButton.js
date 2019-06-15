import { getAuditLog } from "../../../services/api";
import csvStringify from "csv-stringify/lib/sync";
import FileSaver from "file-saver";
import { LoaderButton } from "../../../theme";
import React, { useState } from "react";
import Moment from "moment";
import { connect } from "react-redux";

export const eventTypes = {
  "create": "New meeting",
  "end": "End meeting",
  "start-early": "Start early",
  "check-in": "Check in",
  "extend": "Extend",
  "cancel": "Cancel",
  "auto-cancel": "Auto cancel",
  "auto-cancel-recurring": "Remove recurring"
};

const mapEventForReport = calendars => event => {
  const calendar = calendars[event.calendarId];

  return ({
    "Time": Moment(event.createdAt).format("L LTS"),
    "Event": eventTypes[event.eventType],
    "Room": calendar ? calendar.summary : "Unknown",
    "Meeting": event.meetingSummary
  });
};


const GenerateReportButton = ({ calendars }) => {
  const [isGenerating, setGenerating] = useState(false);

  const generateReport = async () => {
    setGenerating(true);

    const audit = await getAuditLog(true);
    const events = audit.map(mapEventForReport(calendars));

    const blob = new Blob([csvStringify(events, { header: true })], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, `audit-report-${Date.now()}.csv`);

    setGenerating(false);

  };
  return <LoaderButton isLoading={isGenerating} onClick={generateReport}>Get report</LoaderButton>;
};

const mapStateToProps = state => ({
  calendars: state.calendars
});


export default connect(mapStateToProps)(GenerateReportButton);


