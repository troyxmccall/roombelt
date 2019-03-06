import styled, { keyframes } from "styled-components/macro";

const rotation = keyframes`
100% { transform: rotate(360deg); }
`;

export default styled.div`
  display: inline-block;
  height: 2.5em;
  width: 2.5em;
  color: ${props => (props.white ? "white" : "#467fcf")};
  position: relative;

  &:before,
  &:after {
    display: inline-block;
    box-sizing: border-box;
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  &:before {
    border-radius: 50%;
    border: 0.2em solid currentColor;
    opacity: 0.15;
  }

  &:after {
    border: 0.2em solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: infinite ${rotation} 0.6s linear;
  }
`;
