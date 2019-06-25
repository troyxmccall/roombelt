import React from "react";
import styled from "styled-components/macro";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 0 0 30px;
  margin: 0;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 270px;
`;

const Content = styled.div`
  flex: 300px 1 0;
  padding-bottom: 30px;
`;

const Image = styled.img`
  height: 270px;
  margin-left: 20px;
  flex: auto 0 1;
`;

export default props => (
  <Wrapper>
    <Content>{props.children}</Content>
    <Image src={props.img} alt=""/>
  </Wrapper>
);
