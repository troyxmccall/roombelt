import React from "react";
import styled, { css } from "styled-components/macro";
import colors from "./colors";

export default styled.button`
  min-width: 5em;
  padding: 0.3em;
  text-align: center;
  white-space: nowrap;
  
  color: ${props => props.disabled ? colors.foreground.gray : colors.foreground.white};
  outline: none;
  
  font: inherit;
  font-size: 1em;
  border-radius: 0.2em;
  border: 0.1em solid #606060;
  background: transparent;
  margin-right: .5em;
  
  ${props => !props.disabled && css`
    cursor: pointer;
    
    :hover {
      background: #606060;
      ${props => props.success && `background: ${colors.success}`};
      ${props => props.error && `background: ${colors.error}`};
    }
  `}
  
  ${props => props.success && `border-color: ${colors.success}`};
  ${props => props.error && `border-color: ${colors.error}`};
  ${props => props.warning && `border-color: ${colors.warning}`};
  ${props => props.info && `border-color: ${colors.info}`};
  
  ${props => props.subtle && css`
    border: none;
  `};
`;

