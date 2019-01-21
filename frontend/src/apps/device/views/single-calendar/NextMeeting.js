import React from "react";
import i18next from "i18next";
import { connect } from "react-redux";
import styled from "styled-components/macro";

import { Time } from "theme/index";
import { MeetingTitle, MeetingSubtitle } from "./Components";
import { nextMeetingSelector } from "../../store/selectors";
import { isAmPmClockSelector } from "apps/device/store/selectors";

const Wrapper = styled.div`
  padding:0.5em;
`;

const NextMeeting = ({ nextMeeting, isAmPmClock }) =>
  <Wrapper>
    <MeetingTitle>
      {i18next.t("meeting.next")}
    </MeetingTitle>
    <MeetingSubtitle>
      {nextMeeting.summary + " "}
      {!nextMeeting.isAllDayEvent && <>
        <Time timestamp={nextMeeting.startTimestamp} ampm={isAmPmClock}/>
        {" - "}
        <Time timestamp={nextMeeting.endTimestamp} ampm={isAmPmClock}/>
      </>}
    </MeetingSubtitle>
  </Wrapper>;

const mapStateToProps = state => ({
  nextMeeting: nextMeetingSelector(state),
  isAmPmClock: isAmPmClockSelector(state)
});

export default connect(mapStateToProps)(NextMeeting);
