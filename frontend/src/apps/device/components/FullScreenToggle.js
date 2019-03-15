import React from "react";
import i18next from "i18next";
import styled, { keyframes } from "styled-components/macro";
import { connect } from "react-redux";
import IoAndroidExpand from "react-icons/lib/io/android-expand";
import { deviceActions } from "apps/device/store/actions";
import { isCalendarSelectedSelector, isDashboardDeviceSelector } from "apps/device/store/selectors";

const autoHide = keyframes`
  from { visibility: visible }
  to { visibility: hidden }
`;

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.7;
  background: black;
  color: white;
  padding: 0.5em;
  cursor: pointer;
  border: 0.05em solid white;
  border-bottom: none;
  
  animation: ${autoHide} 60s forwards;
`;

const FullScreenToggle = props => {
  const isConnected = props.isCalendarSelected || props.isDashboardDevice;

  if (!isConnected || !props.isFullScreenSupported || props.isFullScreen) {
    return null;
  }

  return (
    <Wrapper onClick={props.requestFullScreen}>
      <IoAndroidExpand/> <span style={{ verticalAlign: "middle" }}>{i18next.t("full-screen")}</span>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  isDashboardDevice: isDashboardDeviceSelector(state),
  isCalendarSelected: isCalendarSelectedSelector(state),
  isFullScreenSupported: state.fullScreen.isSupported,
  isFullScreen: state.fullScreen.isFullScreen
});

const mapDispatchToProps = dispatch => ({
  requestFullScreen: () => dispatch(deviceActions.requestFullScreen())
});

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenToggle);
