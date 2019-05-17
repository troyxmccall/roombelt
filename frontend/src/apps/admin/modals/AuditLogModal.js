import React from "react";
import { connect } from "react-redux";
import Moment from "moment";
import styled from "styled-components/macro";
import ms from "ms";
import { BlueModal, Button, Text } from "theme";
import { auditLogEntriesSelector, isAuditLogLoadingSelector, isAuditLogVisibleSelector } from "../store/selectors";
import { auditLogActions } from "../store/actions";
import ReactTable from "react-table";
import "react-table/react-table.css";

const Table = styled(ReactTable)`
  .rt-tr:hover  {
    background: #f5f5f5 !important;
  }
  .rt-tr:hover .audit-log-entry-time > :nth-child(1) {
     display: none; 
  }
  
  .rt-tr:not(:hover) .audit-log-entry-time > :nth-child(2) {
     display: none; 
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
`;

const eventTypes = {
  "create": "Create meeting",
  "end": "End meeting",
  "start-early": "Start early",
  "check-in": "Check in",
  "extend": "Extend meeting",
  "cancel": "Cancel manually",
  "auto-cancel": "Cancel automatically"
};

const AuditLogModal = ({ onClose, isVisible, devices, calendars, entries }) => {
  const columns = [
    {
      Header: "Time",
      accessor: "createdAt",
      width: 200,
      className: "audit-log-entry-time",
      Cell: ({ value }) => (<>
        <span>{Moment(value).fromNow()}</span>
        <span>{Moment(value).format("L LTS")}</span>
      </>),
      filterMethod: (filter, row) => !filter.value || new Date(row.createdAt).getTime() > Date.now() - ms(filter.value),
      Filter: ({ filter, onChange }) =>
        <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : "7 days"}
        >
          <option value={"24h"}>Last 24 hours</option>
          <option value={"3 days"}>Last 3 days</option>
          <option value={"7 days"}>Last 7 days</option>
        </select>
    },
    {
      Header: "Event",
      accessor: "eventType",
      width: 140,
      Cell: ({ value }) => (eventTypes[value]),
      Filter: ({ filter, onChange }) =>
        <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : ""}
        >
          <option value="" key="all">All events</option>
          {Object.entries(eventTypes).map(entry => <option key={entry[0]} value={entry[0]}>{entry[1]}</option>)}
        </select>
    },
    {
      Header: "Room",
      id: "room",
      accessor: row => {
        const calendar = calendars[row.calendarId];
        return calendar ? calendar.summary : "Unknown";
      },
      width: 300,
      filterMethod: (filter, row) => !filter.value || row.room === filter.value,
      Filter: ({ filter, onChange }) =>
        <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : ""}
        >
          <option value="" key="all">All rooms</option>
          {devices
            .map(device => calendars[device.calendarId] && calendars[device.calendarId].summary)
            .filter((calendarName, i, array) => calendarName && array.indexOf(calendarName) === i)
            .map((calendarName, i) => (
              <option key={i} value={calendarName}>{calendarName}</option>
            ))
          }
        </select>
    },
    {
      Header: "Meeting",
      accessor: "meetingSummary",
      filterMethod: (filter, row) => row.meetingSummary.toLowerCase().indexOf(filter.value.trim().toLowerCase()) !== -1,
      Filter: ({ filter, onChange }) => (
        <input onChange={event => onChange(event.target.value)}
               value={filter ? filter.value : ""}
               placeholder="Search by meeting title"
               style={{ width: "100%" }}
        />
      )
    }
  ];

  return (
    <BlueModal
      title="Audit log"
      visible={isVisible}
      footer={(
        <Footer>
          <Text>Audit log shows up to 5000 events from the last 7 days</Text>
          <Button primary onClick={onClose}>Close</Button>
        </Footer>
      )}
      fullWidth
    >
      <Table
        className={"-highlight"}
        data={entries}
        columns={columns}
        showPagination={true}
        showPageSizeOptions={false}
        sortable={false}
        minRows={5}
        pageSize={50}
        style={{ maxHeight: "calc(100vh - 250px)" }}
        filterable={true}
        noDataText={"No events match selected filters"}
      />
    </BlueModal>
  );
};

const mapStateToProps = state => ({
  isVisible: isAuditLogVisibleSelector(state),
  isLoading: isAuditLogLoadingSelector(state),
  entries: auditLogEntriesSelector(state),
  calendars: state.calendars,
  devices: state.devices.data
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(auditLogActions.hide())
});

export default connect(mapStateToProps, mapDispatchToProps)(AuditLogModal);
