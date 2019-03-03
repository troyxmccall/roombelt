import React from "react";
import i18next from "i18next";
import { connect } from "react-redux";
import {
  connectionCodeSelector,
  isCalendarSelectedSelector,
  isDashboardDeviceSelector,
  isDeviceConnectedSelector,
  isDeviceRemovedSelector,
  isSubscriptionCancelledSelector,
  showAllCalendarsViewSelector
} from "./store/selectors";

import Dashboard from "./views/dashboard";
import SingleCalendar from "./views/single-calendar";
import AllCalendars from "./views/find-room";
import ConnectionCode from "./views/connect/ConnectionCode";
import NoCalendar from "./views/connect/NoCalendar";
import FatalError from "theme/layouts/FatalError";
import { deviceActions } from "apps/device/store/actions";

const Router = ({ connectionCode, isDashboardDevice, isCalendarSelected, isDeviceConnected, isDeviceRemoved, isSubscriptionCancelled, isOffline, disconnectDevice, showAllCalendarsView }) => {
  if (isOffline) return <FatalError title={i18next.t("errors.unable-to-connect-server")}/>;
  if (isDeviceRemoved) return <FatalError title={i18next.t("errors.device-disconnected-title")}
                                          subtitle={i18next.t("errors.device-disconnected-message")}
                                          onClick={disconnectDevice}
                                          button={"OK"}/>;
  if (isSubscriptionCancelled) return <FatalError title={i18next.t("errors.subscription-cancelled")}/>;
  if (isDashboardDevice) return <Dashboard/>;
  if (showAllCalendarsView) return <AllCalendars/>;
  if (isCalendarSelected) return <SingleCalendar/>;
  if (isDeviceConnected) return <NoCalendar/>;
  if (connectionCode) return <ConnectionCode connectionCode={connectionCode}/>;

  return null;
};

const mapStateToProps = state => ({
  language: state.language,
  isOffline: state.appState.isOffline,
  connectionCode: connectionCodeSelector(state),
  isDeviceConnected: isDeviceConnectedSelector(state),
  isDashboardDevice: isDashboardDeviceSelector(state),
  isCalendarSelected: isCalendarSelectedSelector(state),
  isDeviceRemoved: isDeviceRemovedSelector(state),
  isSubscriptionCancelled: isSubscriptionCancelledSelector(state),
  showAllCalendarsView: showAllCalendarsViewSelector(state)
});

const mapDispatchToProps = dispatch => ({
  disconnectDevice: () => dispatch(deviceActions.disconnectDevice())
});

export default connect(mapStateToProps, mapDispatchToProps)(Router);
