import React from "react";
import i18next from "i18next";
import styled from "styled-components/macro";
import { connect } from "react-redux";

import { isActionErrorSelector, isRetryingActionSelector } from "apps/device/store/selectors";

import { meetingActions } from "apps/device/store/actions";
import LoaderButton from "dark/LoaderButton";
import Button from "dark/Button";
import colors from "dark/colors";

const Wrapper = styled.div`
  color: ${colors.foreground.white}
`;

const ErrorTitle = styled.div`
  margin-right: 1em;
  display: inline-block;
`;

const ErrorSubtitle = styled.div`
  margin-top: 1em;
  color: ${colors.foreground.gray}
`;

const ActionError = ({ isActionError, isRetryingAction, cancelAction, retryAction, style }) => (
  <Wrapper style={style}>
    <ErrorTitle>{i18next.t("errors.action-error-title")}</ErrorTitle>
    <LoaderButton primary onClick={retryAction} isLoading={isRetryingAction}>
      {i18next.t("actions.retry")}
    </LoaderButton>
    <Button disabled={isRetryingAction} onClick={cancelAction}>
      {i18next.t("actions.cancel")}
    </Button>
    <ErrorSubtitle>{i18next.t("errors.action-error-subtitle")}</ErrorSubtitle>
  </Wrapper>
);

const mapStateToProps = state => ({
  isActionError: isActionErrorSelector(state),
  isRetryingAction: isRetryingActionSelector(state)
});

const mapDispatchToProps = dispatch => ({
  retryAction: () => dispatch(meetingActions.retry()),
  cancelAction: () => dispatch(meetingActions.endAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionError);