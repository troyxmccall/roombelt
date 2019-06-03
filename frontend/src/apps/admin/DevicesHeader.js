import React from "react";
import { connect } from "react-redux";

import IoPlusRound from "react-icons/lib/io/plus";
import IoIosPulse from "react-icons/lib/io/ios-pulse";
import { Button, PageTitle } from "../../theme";
import { auditLogActions, connectDeviceWizardActions } from "apps/admin/store/actions";

const StatisticsButton = props => (
  <Button secondary style={{ marginLeft: 10, fontSize: 13 }} onClick={props.onClick}>
    <IoIosPulse/> <span style={{ verticalAlign: "middle" }}>Audit log</span>
  </Button>
);

const ConnectDeviceButton = props => (
  <Button primary style={{ marginLeft: 10, fontSize: 13 }} onClick={props.onClick}>
    <IoPlusRound/> <span style={{ verticalAlign: "middle" }}>New device</span>
  </Button>
);

const DevicesHeader = props => (
  <PageTitle style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
    <span>Dashboard</span>
    <span>
      {props.hasAnyDevices && <StatisticsButton onClick={props.onShowAuditLogClick}/>}
      {props.hasAnyDevices && <ConnectDeviceButton onClick={props.onConnectDeviceClick}/>}
    </span>
  </PageTitle>
);

const mapStateToProps = state => ({
  hasAnyDevices: state.devices.data.length > 0
});

const mapDispatchToProps = dispatch => ({
  onConnectDeviceClick: () => dispatch(connectDeviceWizardActions.show()),
  onShowAuditLogClick: () => dispatch(auditLogActions.show())
});

export default connect(mapStateToProps, mapDispatchToProps)(DevicesHeader);
