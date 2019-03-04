import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";

import DateRange from "react-icons/lib/md/date-range";

import { Time } from "theme/index";
import { nextMeetingSelector } from "../../store/selectors";
import { isAmPmClockSelector } from "apps/device/store/selectors";
import Section from "dark/Section";
import colors from "dark/colors";

const Wrapper = styled(Section).attrs({ footer: true })`
  padding: 0.6em 1.2em;
  display: flex;
  align-items: baseline;
  color: ${colors.foreground.white};
`;

const NextLabel = styled.div`
   font-size: 1.5em;
`;

const NextMeetingSummary = styled.div`
  font-size: 1.2em;
  margin-right: 1em;
  margin-left: 1em;
  flex-shrink: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const NextMeetingTime = styled.div`
  color: ${colors.foreground.gray};
  margin-right: 0.5em;
  white-space: nowrap;
`;

const NextMeeting = ({ nextMeeting, isAmPmClock }) =>
  <Wrapper>
    <NextLabel>Next</NextLabel>
    <div style={{ flexGrow: 1 }}/>
    <NextMeetingSummary>{nextMeeting.summary}</NextMeetingSummary>
    {" "}
    <NextMeetingTime>
      {!nextMeeting.isAllDayEvent && <>
        <Time timestamp={nextMeeting.startTimestamp} ampm={isAmPmClock}/>
        {" - "}
        <Time timestamp={nextMeeting.endTimestamp} ampm={isAmPmClock}/>
      </>}
    </NextMeetingTime>
    <DateRange style={{ transform: "translateY(0.1em)" }}/>
  </Wrapper>;

const mapStateToProps = state => ({
  nextMeeting: nextMeetingSelector(state),
  isAmPmClock: isAmPmClockSelector(state)
});

export default connect(mapStateToProps)(NextMeeting);
