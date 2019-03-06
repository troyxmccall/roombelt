import React from "react";
import styled from "styled-components/macro";
import { css } from "styled-components/macro";
import colors from "./colors";

export const partialMixin = css`
  position: relative;
  z-index: 0;
    
  :before {
    content: '';
    background: ${colors.background.black};
    position: absolute;
    left: 0; 
    right: 0;
    top: 0;
    bottom: 50%;
    z-index: -1;
  }
`;

export const Header = styled.div`
  background: ${colors.background.black};
`;

export const Footer = styled.div`
  background: ${colors.background.light};
`;

export const Content = styled.div`
  background: ${colors.background.medium};
  
  ${props => props.partial && partialMixin}
`;

export default props => {
  if (props.header) return <Header {...props}/>;
  if (props.footer) return <Footer {...props}/>;

  return <Content {...props}/>;
}