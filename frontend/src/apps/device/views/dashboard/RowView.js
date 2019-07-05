import React, { useRef } from "react";
import styled, { css } from "styled-components/macro";
import { useIsVisible } from "utils/react";
import Section  from "dark/Section";
import colors from "dark/colors";


const RowWrapper = styled(Section)`
  color: ${colors.foreground.white};
  padding: 0.3rem 0.85rem;
  ${props => props.header && css`
    font-size: 0.6rem;
  `}

  ${props => !props.header && css`
    background: transparent;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    padding: 0.6rem 0.85rem 0 0.85rem;
  `}
`;

const RowContent = styled.div`
  display: flex;
  align-items: center;
  
  ${props => !props.header && css`
    background: #424242;
    box-sizing: border-box;
    padding: 0.5rem 0;    
`};
`;

const MeetingSummary = styled.div`
  flex: 1 1 0;
  padding: 0 0.5rem;
  ${props => props.header && "transform: translateX(-0.5rem)"};
  
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const CalendarName = styled.div`
  flex: 0.6 1 0;
  padding: 0 0.5rem;
  
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const MeetingStatus = styled.div`
  flex: 0 0 10rem;
  padding: 0 0.5rem;
`;

export default ({ meetingSummary, meetingRoom, meetingStatus, header, style = {} }) => {
  const elRef = useRef();
  const isVisible = useIsVisible(elRef);

  return (
    <RowWrapper header={header} style={{ visibility: isVisible ? "visible" : "hidden", ...style }}>
      <RowContent header={header} ref={elRef}>
        <MeetingSummary header={header}>{meetingSummary}</MeetingSummary>
        <CalendarName>{meetingRoom}</CalendarName>
        <MeetingStatus>{meetingStatus}</MeetingStatus>
      </RowContent>
    </RowWrapper>
  );
};