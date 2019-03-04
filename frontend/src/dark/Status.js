import styled from "styled-components";
import colors from "dark/colors";

export default styled.div`
  color: #FAFAFA;
  padding: 0.2em;
  min-width: 8em;
  box-sizing: border-box;
  border-radius: 0.1em;
  text-align: center;

  ${props => props.available && `background: ${colors.success}`};
  ${props => props.occupied && `background: ${colors.error}`};
  ${props => props.warning && `background: ${colors.warning}`};
  ${props => props.info && `background: ${colors.info}`};
`;
