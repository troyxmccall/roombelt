import React from "react";
import styled, { createGlobalStyle } from "styled-components/macro";
import colors from "dark/colors";

const RootFontSize = createGlobalStyle`
  :root {
    @media (min-width: 300px) {
      font-size: ${props => 10 * props.fontSize}px;
    }
  
    @media (min-width: 500px) {
      font-size: ${props => 16 * props.fontSize}px;
    }
  
    @media (min-width: 700px) {
      font-size: ${props => 20 * props.fontSize}px;
    }
  
    @media (min-width: 900px) {
      font-size: ${props => 24 * props.fontSize}px;
    }
  
    @media (min-width: 1100px) {
      font-size: ${props => 30 * props.fontSize}px;
    }
  
    @media (min-width: 1300px) {
      font-size: ${props => 35 * props.fontSize}px;
    }
  
    @media (min-width: 1500px) {
      font-size: ${props => 40 * props.fontSize}px;
    }
  
    @media (min-width: 1700px) {
      font-size: ${props => 46 * props.fontSize}px;
    }
  }
`;

export default styled(props => (<>
    <RootFontSize fontSize={props.fontSize || 1}/>
    <div {...props}/>
  </>
))`
  display: ${props => props.flexbox ? "flex" : "block"};
  flex-direction: column;
  height: 100%;
  width: 100%;
  font-family: 'Abel', sans-serif;
  background: ${colors.background.medium};
`;
