import React from "react";
import styled from "styled-components/macro";
import { currentMeetingSelector, nextMeetingSelector, requireCheckInSelector } from "apps/device/store/selectors";
import { connect } from "react-redux";
import Status from "dark/Status";
import i18next from "i18next";

const RoomStatus = ({ currentMeeting, nextMeeting, currentTimestamp, requireCheckIn }) => {
  if (!currentMeeting) {
    return <Status available>{i18next.t("availability.available")}</Status>;
  }

  if (currentMeeting.isAllDayEvent) {
    return <Status occupied>{i18next.t("availability.occupied-all-day")}</Status>;
  }

  if (currentMeeting.isCheckedIn) {
    return <Status occupied>{i18next.t("availability.occupied")}</Status>;
  }

  const fromStart = Math.floor((currentTimestamp - currentMeeting.startTimestamp) / 1000 / 60);

  if (fromStart < 0) {
    return <Status warning>{i18next.t("availability.starts.in", { count: -fromStart })}</Status>;
  }

  if (fromStart === 0) {
    return <Status occupied>{i18next.t("availability.starts.now", { count: -fromStart })}</Status>;
  }

  if (requireCheckIn) {
    return <Status occupied>{i18next.t("availability.starts.ago", { count: fromStart })}</Status>;
  }

  return <Status occupied>{i18next.t("availability.occupied")}</Status>;
};

const Wrapper = styled.div`
  font-size: 2rem;
`;

const mapStateToProps = state => ({
  currentTimestamp: state.timestamp,
  currentMeeting: currentMeetingSelector(state),
  nextMeeting: nextMeetingSelector(state),
  requireCheckIn: requireCheckInSelector(state)
});

export default connect(mapStateToProps)(props => <Wrapper><RoomStatus {...props} /></Wrapper>);
