import PropTypes from "prop-types";
import React from "react";
import styled, { css } from "styled-components/macro";

import colors from "../colors";

const defaultColors = css`
  color: #495057;
  background-color: #f0f0f0;
  box-shadow: 0 0.1rem 0.1rem 0 rgba(0, 0, 0, 0.05);
  border: none;

  &:hover:not([disabled]) {
    background-color: #e0e0e0;
    border-color: rgba(0, 20, 49, 0.12);
  }
`;

const whiteColors = props => {
  if (!props.white) return null;

  return css`
    color: #333;
    background-color: #fff;
    box-shadow: 0 0.1rem 0.1rem 0 rgba(0, 0, 0, 0.05);
    border: none;

    &:hover:not([disabled]) {
      background-color: #eee;
    }
  `;
};

const secondaryColors = props => {
  if (!props.secondary) return null;

  return css`
    color: #495057;
    background-color: #fff;
    user-select: none;
    border: 1px solid rgba(0, 40, 100, 0.12);
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);

    &:hover:not([disabled]) {
      color: #495057;
      background-color: #f6f6f6;
      border-color: rgba(0, 20, 49, 0.12);
    }
  `;
};

const variantColors = props => {
  const variantName = Object.keys(colors.variants).find(variantName => props[variantName]);
  if (!variantName) return;

  const variant = colors.variants[variantName];
  return css`
    border-color: ${variant};
    background: ${variant};
    color: ${variant.contrast};
    box-shadow: none;

    &:hover:not([disabled]) {
      background: ${variant.hover};
      border-color: ${variant.hover};
    }
  `;
};

const compactStyles = props => {
  if (!props.compact && !props.small) return;

  return css`
    font-weight: 400;
    padding: 0.1em 0.4em;
    font-size: 0.8em;
  `;
};

const linkStyles = () => {
  return css`
    border: none;
    box-shadow: none;
    color: ${colors.primary};
    background-color: transparent;

    &:hover:not([disabled]) {
      color: #295a9f;
      text-decoration: underline;
      background-color: transparent;
      border-color: transparent;
    }
  `;
};

const UnderlyingComponent = props =>
  props.href ? (
    <a
      className={props.className}
      children={props.children}
      href={props.href}
      target={props.target}
      onClick={props.onClick}
      style={props.style}
      tabIndex={props.tabIndex}
    />
  ) : (
    <button
      className={props.className}
      style={props.style}
      disabled={props.disabled}
      children={props.children}
      onClick={props.onClick}
      tabIndex={props.tabIndex}
    />
  );

const Button = styled(UnderlyingComponent)`
  display: ${props => (props.block ? "block" : "inline-block")};
  min-width: 6em;
  text-align: center;
  font-family: "Roboto", sans-serif;
  border-radius: 0.2em;
  font-size: 1em;
  padding: 0.75em;
  user-select: none;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;

  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  ${defaultColors};
  ${whiteColors};
  ${variantColors};
  ${secondaryColors};
  ${compactStyles};

  ${props => props.link && linkStyles} &[disabled] {
    opacity: 0.65;
    cursor: default;
  }

  + button ,
  + a {
    ${props => (props.block ? "margin-top: 0.5rem" : "margin-left: 0.75rem;")};
  }
`;

Button.propTypes = {
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  success: PropTypes.bool,
  info: PropTypes.bool,
  warning: PropTypes.bool,
  danger: PropTypes.bool,
  link: PropTypes.bool,
  white: PropTypes.bool,

  disabled: PropTypes.bool,
  block: PropTypes.bool,
  compact: PropTypes.bool,
  small: PropTypes.bool
};

export default Button;
