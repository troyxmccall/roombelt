import React from "react";
import i18next from "i18next";
import { Badge } from "../../../../theme/index";
import { prettyFormatMinutes } from "../../../../services/formatting";
import { MeetingHeader, MeetingSubtitle } from "./Components";
import { connect } from "react-redux";
import { nextMeetingSelector, minutesAvailableTillNextMeetingSelector } from "../../store/selectors";

const RoomAvailable = props => (
    <React.Fragment>
      <MeetingHeader>
        <Badge success>{i18next.t("availability.available")}</Badge>
      </MeetingHeader>
      <MeetingSubtitle>
        {(props.nextMeeting && props.nextMeeting.startTimestamp)
          ? i18next.t("availability.available-for", { time: prettyFormatMinutes(props.minutesToNextMeeting) })
          : i18next.t("availability.available-all-day")}
      </MeetingSubtitle>
    </React.Fragment>
);

const mapStateToProps = state => ({
  nextMeeting: nextMeetingSelector(state),
  minutesToNextMeeting: minutesAvailableTillNextMeetingSelector(state)
});

export default connect(mapStateToProps)(RoomAvailable);
