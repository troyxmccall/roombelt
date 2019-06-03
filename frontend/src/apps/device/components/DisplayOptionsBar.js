import React from "react";
import styled, { keyframes } from "styled-components/macro";
import { connect } from "react-redux";
import IoAndroidExpand from "react-icons/lib/io/android-expand";
import IoAndroidContract from "react-icons/lib/io/android-contract";
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
  border: 0.05em solid white;
  border-bottom: none;
  display: flex;
  user-select: none;
  
  animation: ${autoHide} 30s forwards;
`;

const Button = styled.button`
  padding: 0.5em 1em;
  cursor: pointer;
  background: transparent;
  border: none;
  color: white;
  font-size: inherit;
  
  :not(:first-child) {
    border-left: 0.05em solid white;
  }
  
  :focus {
    background: #777;
  }
`;

const DisplayOptionsBar = props => {
  const isConnected = props.isCalendarSelected || props.isDashboardDevice;

  if (!isConnected) {
    return null;
  }

  return (
    <Wrapper>
      <Button tabindex={0} onClick={props.decreaseFontSize}>-</Button>
      {props.isFullScreenSupported && <Button tabindex={0} onClick={props.requestFullScreen}>
        {props.isFullScreen ? <IoAndroidContract/> : <IoAndroidExpand/>}
      </Button>}
      <Button tabindex={0} onClick={props.increaseFontSize}>+</Button>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  isDashboardDevice: isDashboardDeviceSelector(state),
  isCalendarSelected: isCalendarSelectedSelector(state),
  isFullScreenSupported: state.displayOptions.isSupported,
  isFullScreen: state.displayOptions.isFullScreen
});

const mapDispatchToProps = dispatch => ({
  requestFullScreen: () => dispatch(deviceActions.toggleFullScreen()),
  increaseFontSize: () => dispatch(deviceActions.changeFontSize(0.05)),
  decreaseFontSize: () => dispatch(deviceActions.changeFontSize(-0.05))
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayOptionsBar);
