import React from "react";
import i18next from "i18next";
import { connect } from "react-redux";

import LoaderButton from "dark/LoaderButton";
import Button from "dark/Button";
import { prettyFormatMinutes } from "services/formatting";
import {
  currentActionSourceSelector,
  currentMeetingSelector,
  isAfterCurrentMeetingStartTimeSelector,
  minutesAvailableTillNextMeetingSelector,
  requireCheckInSelector
} from "apps/device/store/selectors";

import { meetingActions } from "apps/device/store/actions";

class MeetingStarted extends React.PureComponent {
  state = { idOfMeetingToCancel: null };

  render() {
    const { currentMeeting, requireCheckIn, isAfterCurrentMeetingStartTime } = this.props;
    const { idOfMeetingToCancel } = this.state;

    if (idOfMeetingToCancel === currentMeeting.id) {
      return this.renderEndMeetingConfirmation();
    }

    if (currentMeeting.isCheckedIn) {
      return this.renderExtendMeeting();
    }

    if (!isAfterCurrentMeetingStartTime) {
      return this.renderStartMeetingEarly();
    }

    if (requireCheckIn && !currentMeeting.isCheckedIn) {
      return this.renderCheckInToMeeting();
    }

    return this.renderExtendMeeting();
  }

  renderStartMeetingEarly() {
    const { currentMeeting, currentActionSource, startMeetingEarly } = this.props;

    return (
      <>
        <LoaderButton primary
                      key={"start-early"}
                      onClick={() => startMeetingEarly("start-early")}
                      isLoading={currentActionSource === "start-early"}
                      children={i18next.t("actions.start-early")}/>

        <Button key={"cancel"} white onClick={() => this.setState({ idOfMeetingToCancel: currentMeeting.id })}>
          {i18next.t("actions.cancel-meeting")}
        </Button>
      </>
    );
  }

  renderCheckInToMeeting() {
    const { currentMeeting, currentActionSource, checkInToMeeting } = this.props;

    return (
      <>
        <LoaderButton primary
                      key={"check-in"}
                      onClick={() => checkInToMeeting("check-in")}
                      isLoading={currentActionSource === "check-in"}
                      children={i18next.t("actions.check-in")}/>

        <Button key={"cancel"} white onClick={() => this.setState({ idOfMeetingToCancel: currentMeeting.id })}>
          {i18next.t("actions.cancel-meeting")}
        </Button>
      </>
    );
  }

  renderExtendMeeting() {
    const { currentMeeting, minutesToNextMeeting, currentActionSource, extendMeeting } = this.props;

    const ExtendButton = ({ value, name }) => (
      <LoaderButton
        key={name}
        white
        disabled={currentActionSource !== null}
        isLoading={currentActionSource === name}
        onClick={() => extendMeeting(value, name)}
        children={prettyFormatMinutes(value)}
      />
    );

    const showCustomExtensionTime = minutesToNextMeeting > 0 && minutesToNextMeeting <= 70;

    return (
      <>
        <Button error
                key={'end-now'}
                disabled={currentActionSource !== null}
                onClick={() => this.setState({ idOfMeetingToCancel: currentMeeting.id })}>
          {i18next.t("actions.end-now")}
        </Button>

        {minutesToNextMeeting > 0 && (
          <>
            <Button success disabled>{i18next.t("actions.extend")}</Button>
            {minutesToNextMeeting > 20 && <ExtendButton value={15} name="extend-15"/>}
            {minutesToNextMeeting > 40 && <ExtendButton value={30} name="extend-30"/>}
            {minutesToNextMeeting > 70 && <ExtendButton value={60} name="extend-60"/>}
            {showCustomExtensionTime && <ExtendButton value={minutesToNextMeeting} name="extend-custom"/>}
          </>
        )}
      </>
    );
  }

  renderEndMeetingConfirmation() {
    const { currentActionSource, isAfterCurrentMeetingStartTime, cancelMeeting, endMeeting } = this.props;

    const isInProgress = currentActionSource === "end-meeting";
    const onConfirm = () => isAfterCurrentMeetingStartTime ? endMeeting("end-meeting") : cancelMeeting("end-meeting");

    return (
      <>
        <Button key={'back'} disabled={isInProgress} onClick={() => this.setState({ idOfMeetingToCancel: null })} white>
          {i18next.t("actions.back")}
        </Button>
        <LoaderButton key={'confirm'} isLoading={isInProgress} onClick={onConfirm} error>
          {i18next.t("actions.confirm")}
        </LoaderButton>
      </>
    );
  }
}

const mapStateToProps = state => ({
  requireCheckIn: requireCheckInSelector(state),
  currentMeeting: currentMeetingSelector(state),
  currentActionSource: currentActionSourceSelector(state),
  minutesToNextMeeting: minutesAvailableTillNextMeetingSelector(state),
  isAfterCurrentMeetingStartTime: isAfterCurrentMeetingStartTimeSelector(state)
});

const mapDispatchToProps = dispatch => ({
  startMeetingEarly: (source) => {
    dispatch(meetingActions.startMeetingEarly());
    dispatch(meetingActions.$setActionSource(source));
  },
  cancelMeeting: (source) => {
    dispatch(meetingActions.cancelMeeting());
    dispatch(meetingActions.$setActionSource(source));
  },
  checkInToMeeting: (source) => {
    dispatch(meetingActions.checkInToMeeting());
    dispatch(meetingActions.$setActionSource(source));
  },
  extendMeeting: (minutes, source) => {
    dispatch(meetingActions.extendMeeting(minutes));
    dispatch(meetingActions.$setActionSource(source));
  },
  endMeeting: (source) => {
    dispatch(meetingActions.endMeeting());
    dispatch(meetingActions.$setActionSource(source));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingStarted);