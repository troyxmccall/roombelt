import React from "react";
import i18next from "i18next";
import { prettyFormatMinutes } from "../../../../services/formatting";
import { MeetingSubtitle } from "./Components";
import { connect } from "react-redux";
import { minutesAvailableTillNextMeetingSelector, nextMeetingSelector } from "../../store/selectors";

const RoomAvailable = props => (
  <>
    <MeetingSubtitle>
      {(props.nextMeeting && props.nextMeeting.startTimestamp)
        ? i18next.t("availability.available-for", { time: prettyFormatMinutes(props.minutesToNextMeeting) })
        : i18next.t("availability.available-all-day")}
    </MeetingSubtitle>
  </>
);

const mapStateToProps = state => ({
  nextMeeting: nextMeetingSelector(state),
  minutesToNextMeeting: minutesAvailableTillNextMeetingSelector(state)
});

export default connect(mapStateToProps)(RoomAvailable);
