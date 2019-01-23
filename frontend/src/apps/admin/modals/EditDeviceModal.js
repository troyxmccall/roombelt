import React, { useRef, useEffect } from "react";
import styled from "styled-components/macro";
import { connect } from "react-redux";

import { Modal, Button, LoaderButton, Select, Text } from "theme";
import { translations } from "i18n";
import { editDeviceDialogActions } from "apps/admin/store/actions";

const FormField = styled.div`
  margin-bottom: 20px;
`;

const FormFieldLabel = styled.label`
  margin-bottom: 5px;
  display: block;
  color: #333;
`;

const LocaleWrapper = styled.div`
  display: flex;
  justify-content: stretch;
  width: 100%;
  
  > :first-child {
    flex: 1 1 0;
  }
  
  > :last-child {
    width: 130px;
    margin-left: 20px;
  }
`;

const EditDeviceModal = ({ isVisible, isSaving, device, calendars, onCancel, onSubmit, onChangeType, onChangeCalendar, onChangeLanguage, onChangeMinutesForCheckIn, onChangeClockType }) => {
  const select = useRef();
  useEffect(() => {
    if (isVisible) select.current.focus();
  }, [isVisible]);

  const footer = (
    <>
      <div style={{ flexGrow: 1 }}/>
      <Button disabled={isSaving} onClick={onCancel}>Cancel</Button>
      <LoaderButton primary onClick={onSubmit} isLoading={isSaving}>
        OK
      </LoaderButton>
    </>
  );

  const getValue = ({ deviceType, calendarId }) => `${deviceType}-${calendarId}`;

  const viewOptions = [
    { label: "Dashboard", deviceType: "dashboard", calendarId: null, isDisabled: false },
    {
      label: "Calendars",
      options: Object.values(calendars).map(calendar => ({
        label: calendar.summary + (calendar.canModifyEvents ? "" : " (read only)"),
        deviceType: "calendar",
        calendarId: calendar.id,
        isDisabled: !calendar.canModifyEvents
      }))
    }
  ];

  const onOptionSelected = option => {
    onChangeCalendar(option && option.calendarId);
    onChangeType(option && option.deviceType);
  };

  return (
    <Modal
      title="Device settings"
      visible={isVisible}
      footer={footer}
      onCloseButtonClicked={onCancel}
    >
      <FormField>
        <FormFieldLabel>View</FormFieldLabel>
        <Select
          instanceId="edit-device-choose-calendar"
          getOptionValue={getValue}
          value={device && getValue(device)}
          options={viewOptions}
          onChange={onOptionSelected}
          ref={select}
        />
      </FormField>

      <FormField>
        <FormFieldLabel>Locale</FormFieldLabel>
        <LocaleWrapper>
          <Select
            instanceId="edit-device-choose-language"
            value={(device && device.language) || "en-US"}
            options={Object.values(translations)}
            getOptionLabel={lang => lang.language}
            getOptionValue={lang => lang.key}
            onChange={translation => onChangeLanguage && onChangeLanguage(translation && translation.key)}
          />
          <Select
            instanceId="edit-device-choose-clock-type"
            value={(device && device.clockType) || 12}
            options={[{ label: "12h clock", value: 12 }, { label: "24h clock", value: 24 }]}
            onChange={option => onChangeClockType && onChangeClockType(option && option.value)}
          />
        </LocaleWrapper>
      </FormField>

      {device && device.deviceType === "calendar" && <FormField>
        <FormFieldLabel>Require check-in</FormFieldLabel>
        <Select
          instanceId="edit-device-require-check-in"
          value={device && device.minutesForCheckIn}
          options={[{ label: "No", value: 0 }, { label: "Yes", value: 10 }]}
          onChange={option => onChangeMinutesForCheckIn(option.value)}
        />
        <Text block small muted style={{ marginTop: 5 }}>
          Enable to remove meetings automatically if nobody checks-in during first 10 minutes.
        </Text>
      </FormField>}
    </Modal>
  );
};

const mapStateToProps = state => ({
  isVisible: !!state.editedDevice.data,
  isSaving: state.editedDevice.isSaving,
  device: state.editedDevice.data,
  calendars: state.calendars
});

const mapDispatchToProps = dispatch => ({
  onSubmit: () => dispatch(editDeviceDialogActions.submit()),
  onCancel: () => dispatch(editDeviceDialogActions.hide()),
  onChangeType: deviceType => dispatch(editDeviceDialogActions.setDeviceType(deviceType)),
  onChangeCalendar: calendarId => dispatch(editDeviceDialogActions.setCalendarId(calendarId)),
  onChangeLanguage: language => dispatch(editDeviceDialogActions.setLanguage(language)),
  onChangeClockType: clockType => dispatch(editDeviceDialogActions.setClockType(clockType)),
  onChangeMinutesForCheckIn: minutes => dispatch(editDeviceDialogActions.setMinutesForCheckIn(minutes))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDeviceModal);
