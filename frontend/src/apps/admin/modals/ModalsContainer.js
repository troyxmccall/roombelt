import React from "react";
import { connect } from "react-redux";

import EditDeviceModal from "./EditDeviceModal";
import RemoveDeviceModal from "./RemoveDeviceModal";
import AuditLogModal from "./AuditLogModal";
import { removeDeviceDialogActions } from "apps/admin/store/actions";

const name = (device, calendars) => {
  return device ? calendars[device.calendarId] && calendars[device.calendarId].summary : null;
};

const Modals = props => (
  <React.Fragment>
    <EditDeviceModal/>
    <RemoveDeviceModal
      isVisible={!!props.removedDevice}
      onCancel={props.onCancelRemoveDevice}
      onConfirm={props.onConfirmRemoveDevice}
      deviceName={name(props.removedDevice, props.calendars)}
    />
    <AuditLogModal/>
  </React.Fragment>
);

const mapStateToProps = state => ({
  calendars: state.calendars,
  removedDevice: state.removedDevice
});

const mapDispatchToProps = dispatch => ({
  onConfirmRemoveDevice: () => dispatch(removeDeviceDialogActions.submit()),
  onCancelRemoveDevice: () => dispatch(removeDeviceDialogActions.hide())
});

export default connect(mapStateToProps, mapDispatchToProps)(Modals);
