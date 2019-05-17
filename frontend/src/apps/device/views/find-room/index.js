import React from "react";
import styled from "styled-components/macro";
import { connect } from "react-redux";
import i18next from "i18next";
import { deviceActions } from "apps/device/store/actions";
import {
  allCalendarsSelector,
  areAllCalendarsLoadedSelector,
  isAmPmClockSelector,
  timestampSelector
} from "apps/device/store/selectors";


import CalendarRow from "./CalendarRow";
import { Loader } from "theme";

import colors from "dark/colors";
import Button from "dark/Button";
import Layout from "dark/Layout";
import Section from "dark/Section";
import Time from "theme/components/Time";

const Header = styled(Section).attrs({ header: true })`
  padding: 0.85rem;
  font-size: 2rem;
  color: ${colors.foreground.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
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
`;

const LoaderWrapper = styled.div`
  position: absolute; 
  top: 50%;
  left: 50%; 
  transform: translateX(-50%);
`;

const AllCalendarsView = ({ closeAllCalendarsView, calendars, areAllCalendarsLoaded, markUserActivity, timestamp, isAmPmClock }) => {
  return (
    <Layout style={{ minHeight: "100%", height: "auto" }} flexbox>
      <Header>
        <BackButton onClick={closeAllCalendarsView}>{i18next.t("actions.back")}</BackButton>
        <PageTitle>{i18next.t("actions.find-room")}</PageTitle>
        <Time timestamp={timestamp} ampm={isAmPmClock} smallSuffix blinking/>
      </Header>

      <Content onScroll={markUserActivity}>
        {!areAllCalendarsLoaded && <LoaderWrapper><Loader white/></LoaderWrapper>}
        {calendars.map(calendar => <CalendarRow key={calendar.id} calendarId={calendar.id}/>)}
      </Content>
    </Layout>
  );
};

const mapStateToProps = state => ({
  areAllCalendarsLoaded: areAllCalendarsLoadedSelector(state),
  calendars: allCalendarsSelector(state),
  timestamp: timestampSelector(state),
  isAmPmClock: isAmPmClockSelector(state)
});

const mapDispatchToProps = dispatch => ({
  closeAllCalendarsView: () => dispatch(deviceActions.closeAllCalendarsView()),
  markUserActivity: () => dispatch(deviceActions.$allCalendarsViewActivity())
});

export default connect(mapStateToProps, mapDispatchToProps)(AllCalendarsView);