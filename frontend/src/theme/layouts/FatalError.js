import React from "react";
import i18next from "i18next";
import styled from "styled-components/macro";
import { PageTitle, PageSection, PageLoaded } from "..";
import Button from "dark/Button";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #222;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  box-sizing: border-box;
  text-align: center;

  font-size: 2.5vw;
`;

export default props => (
  <Wrapper>
    <PageLoaded/>
    <PageTitle>{props.title}</PageTitle>
    <PageSection>{props.message}</PageSection>
    <PageSection style={{ marginBottom: "2em" }}>
      {props.subtitle || i18next.t("errors.action-error-subtitle")}
    </PageSection>
    <Button success onClick={props.onClick || (() => window.location.reload())}>
      {props.button || i18next.t("errors.refresh-page")}
    </Button>
  </Wrapper>
);
