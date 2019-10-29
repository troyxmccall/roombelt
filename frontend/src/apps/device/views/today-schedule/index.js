import React, { useEffect, useRef } from "react";
import { calendarSelector, isAmPmClockSelector, timestampSelector } from "../../store/selectors";
import { connect } from "react-redux";
import PageLayout from "dark/PageLayout";
import styled from "styled-components/macro";
import ms from "ms";
import i18next from "i18next";
import Time from "theme/components/Time";

const percentage = timestamp => (timestamp - new Date().setHours(0, 0, 0, 0)) / ms("1 day") * 100;

const CalendarContainer = styled.div`
  margin: 1em 0.5em 1em 5em;
  position: relative;
`;

const HourGrid = styled.div`
  box-sizing: border-box;
  height: 3em;
  border-top: 1px solid #ccc;
  color: white;
  position: relative;
 
  & > * {
   position: absolute;
   content: '${props => props.time}';
   line-height: 1em;
   top: -0.55em;
   left: -4em;
  }
 
  :last-child {
   height: 0;
  }
`;

const Event = styled.div`
  position: absolute;
  box-sizing: border-box;
  left: calc(0.3em + 100% - ${props => Math.pow(0.5, props.offset)} * 100%);
  right: 0.3em;
  top: ${props => percentage(props.startTimestamp) + 0.1}%;
  height: ${props => (percentage(props.endTimestamp) - percentage(props.startTimestamp) - 0.2)}%;
  border: 1px solid #777;
  border-radius: 0.3em;
  background: #222;
  color: white;
  padding: 0 0.3em;
  font-size: 0.5em;
  z-index: ${props => props.offset};
`;

const EventSummary = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EventTime = styled.div`
  color: #ccc;
`;

const CurrentTimeLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: ${props => percentage(props.timestamp)}%;
  border-bottom: 1px solid red;
  height: 0;
  z-index: 100;
  
  ::before {
    content: '';
    position: absolute;
    left: 0;
    width: .5em;
    height: .5em;
    background: red;
    transform: translate(-50%, -50%);
    border-radius: .5em;
  }
`;

const useScrollRefIntoView = () => {
  const ref = useRef();

  useEffect(() => {
    ref.current && ref.current.scrollIntoView({ block: "center" });
  }, []);

  return ref;
};

const TodaySchedule = ({ currentCalendar, currentTimestamp, isAmPmClock }) => {
  const currentTime = useScrollRefIntoView();
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);

  const eventsWithOffsets = currentCalendar.events
    .filter(event => event.endTimestamp >= startOfDay && event.startTimestamp <= endOfDay)
    .map(event => ({
      ...event,
      offset: 0,
      visualStartTimestamp: Math.max(event.startTimestamp, startOfDay),
      visualEndTimestamp: Math.max(Math.min(event.endTimestamp, endOfDay), Math.max(event.startTimestamp, startOfDay) + ms("30min"))
    }));

  eventsWithOffsets.forEach((event, i) => {
    for (let j = 0; j < i; j++) {
      const earlierEvent = eventsWithOffsets[j];

      if (
        earlierEvent.visualStartTimestamp < event.visualStartTimestamp &&
        earlierEvent.visualEndTimestamp > event.visualStartTimestamp &&
        earlierEvent.offset === event.offset
      ) {
        event.offset++;
      }
    }
  });

  return (
    <PageLayout isLoaded={true} title={i18next.t("actions.calendar-view")}>

      <CalendarContainer>
        <div>
          {new Array(25).fill(0).map((_, i) => (
            <HourGrid><Time ampm={isAmPmClock}
                            timestamp={new Date().setHours(i, 0, 0, 0)}/>
            </HourGrid>)
          )}
        </div>
        {eventsWithOffsets.map(event => (
          <Event startTimestamp={event.visualStartTimestamp} endTimestamp={event.visualEndTimestamp}
                 offset={event.offset}>
            <EventSummary>{event.summary}</EventSummary>
            {!event.isAllDayEvent && <EventTime>
              <Time ampm={isAmPmClock} timestamp={event.startTimestamp}/>
              {" - "}
              <Time ampm={isAmPmClock} timestamp={event.endTimestamp}/>
            </EventTime>}
          </Event>
        ))}
        <CurrentTimeLine ref={currentTime} timestamp={currentTimestamp}/>
      </CalendarContainer>
    </PageLayout>
  );
};

const mapStateToProps = state => ({
  currentCalendar: calendarSelector(state),
  currentTimestamp: timestampSelector(state),
  isAmPmClock: isAmPmClockSelector(state)
});

export default connect(mapStateToProps)(TodaySchedule);