import React from "react";
import { Badge, Select } from "theme";
import { components } from "react-select";

const connectedDevicesOption = {
  label: "All connected devices",
  isReadOnly: false,
  calendarId: "all-connected-devices"
};

const SingleValue = props => {
  return (
    <components.SingleValue {...props}>
      {props.data.label} {props.data.isReadOnly && <Badge warning style={{ fontSize: 12 }}>Read only</Badge>}
    </components.SingleValue>
  );
};

const Option = props => {
  return (
    <components.Option {...props}>
      {props.data === connectedDevicesOption ? <em>{props.data.label}</em> : props.data.label}
      {" "}
      {props.data.isReadOnly && <Badge warning style={{ fontSize: 12 }}>Read only</Badge>}
    </components.Option>
  );
};

export default React.forwardRef(({ isMulti, options, value, onChange, ...props }, ref) => {
  value = value || "";
  options = options || {};

  const calendarOptions = Object.values(options).map(calendar => ({
    label: calendar.summary,
    isReadOnly: !isMulti && !calendar.canModifyEvents,
    calendarId: calendar.id
  }));

  if (isMulti) {
    calendarOptions.unshift(connectedDevicesOption);
  }

  const selectedValues = (isMulti ? value.split(";") : value);
  const onSelectValue = value => value && onChange(isMulti ? value.map(x => x.calendarId).join(";") : value.calendarId);

  return (
    <Select
      components={{ Option, SingleValue }}
      getOptionValue={option => option.calendarId}
      ref={ref}
      isMulti={isMulti}
      options={calendarOptions}
      value={selectedValues}
      onChange={onSelectValue}
      hideSelectedOptions
      {...props}
    />
  );
});

