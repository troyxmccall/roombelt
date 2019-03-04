import styled from "styled-components/macro";
import colors from "dark/colors";

export default styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  font-family: 'Abel', sans-serif;
  background: ${colors.background.medium};
  
  @media (min-width: 300px) {
    font-size: 10px;
  }

  @media (min-width: 500px) {
    font-size: 16px;
  }

  @media (min-width: 700px) {
    font-size: 20px;
  }

  @media (min-width: 900px) {
    font-size: 24px;
  }

  @media (min-width: 1100px) {
    font-size: 30px;
  }

  @media (min-width: 1300px) {
    font-size: 35px;
  }

  @media (min-width: 1500px) {
    font-size: 40px;
  }

  @media (min-width: 1700px) {
    font-size: 46px;
  }
`;
