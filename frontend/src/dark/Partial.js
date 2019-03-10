import styled from "styled-components/macro";
import colors from "./colors";

export default styled.div`
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

