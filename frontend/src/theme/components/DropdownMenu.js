import React from "react";
import styled, { css } from "styled-components/macro";
import colors from "../colors";

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  user-select: none;
`;

const Dropdown = styled.ul`
  display: ${props => (props.visible ? "block" : "none")};
  z-index: 1;
  position: absolute;
  right: 0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin: 0.125rem 0 0;
  padding: 0;
  min-width: 10rem;
  font-size: 14px;
  color: #6e7687;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 40, 100, 0.12);
  border-radius: 3px;
  
  ${props => props.arrowPosition && css`
    &::before, &::after {
        content: '';
        position: absolute;
        ${props.arrowPosition};
        top: -6px;
        width: 0; 
        height: 0; 
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #ddd;
      }
      
      &::after {
        border-bottom-color: white;
        top: -5px;
      }
  `}
`;

export const DropdownMenuItem = styled.li`
  display: block;
  padding: 0.7rem;
  color: ${colors.foreground};
  border-bottom: 1px solid #eee;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #16181b;
    text-decoration: none;
    background: #fafbfb;
  }
`;

export class DropdownMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.triggerRef = React.createRef();
  }

  state = { isVisible: false };

  render = () => (
    <Wrapper>
      <span ref={this.triggerRef} onClick={this.toggle}>
        {this.props.trigger}
      </span>
      <Dropdown arrowPosition={this.props.arrowPosition} visible={this.state.isVisible}>{this.props.children}</Dropdown>
    </Wrapper>
  );

  toggle = () => {
    this.state.isVisible ? this.hide() : this.show();
  };

  show = () => {
    document.body.addEventListener("click", this.hideOnClick);
    this.setState({ isVisible: true });
  };

  hide = () => {
    document.body.removeEventListener("click", this.hideOnClick);
    this.setState({ isVisible: false });
  };

  hideOnClick = event => {
    if (!this.triggerRef.current.contains(event.target)) {
      this.hide();
    }
  };

  componentWillUnmount() {
    this.hide();
  }
}
