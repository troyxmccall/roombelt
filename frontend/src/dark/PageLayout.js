import React from "react";
import styled from "styled-components/macro";
import i18next from "i18next";
import { Loader } from "theme";
import colors from "dark/colors";
import Button from "dark/Button";
import Layout from "dark/Layout";
import Section from "dark/Section";
import Time from "theme/components/Time";
import { fontSizeSelector, isAmPmClockSelector, timestampSelector } from "../apps/device/store/selectors";
import { connect } from "react-redux";
import { deviceActions } from "../apps/device/store/actions";

const Header = styled(Section).attrs({ header: true })`
  padding: 0.85rem;
  font-size: 2rem;
  color: ${colors.foreground.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const BackButton = styled(Button)`
  font-size: .9rem;
  width: 6rem;
  z-index: 1; 
`;

const PageTitle = styled.span`
  vertical-align: middle;
  margin-left: 1rem;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const LoaderWrapper = styled.div`
  position: absolute; 
  top: 50%;
  left: 50%; 
  transform: translateX(-50%);
`;

const PageLayout = ({ children, isLoaded, title, setMainDeviceView, markUserActivity, timestamp, isAmPmClock, fontSize }) => {
  return (
    <Layout flexbox fontSize={fontSize}>
      <Header>
        <BackButton onClick={setMainDeviceView}>{i18next.t("actions.back")}</BackButton>
        <PageTitle>{title}</PageTitle>
        <Time timestamp={timestamp} ampm={isAmPmClock} smallSuffix blinking/>
      </Header>

      <Content onScroll={markUserActivity}>
        {!isLoaded && <LoaderWrapper><Loader white/></LoaderWrapper>}
        {!!isLoaded && children}
      </Content>
    </Layout>
  );
};

const mapStateToProps = state => ({
  timestamp: timestampSelector(state),
  isAmPmClock: isAmPmClockSelector(state),
  fontSize: fontSizeSelector(state)
});


const mapDispatchToProps = {
  setMainDeviceView: deviceActions.setMainDeviceView,
  markUserActivity: deviceActions.markDeviceViewActivity
};

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);