import React from "react";
import styled from "styled-components/macro";
import { Button, LoaderButton, Select, Text } from "theme";
import WizardStepLayout from "./WizardStepLayout";
import { translations } from "i18n";
import { connectDeviceWizardActions } from "apps/admin/store/actions";
import { connect } from "react-redux";
import { useWizard } from "apps/admin/modals/wizard/Wizard";
import { isGoogleAccountSelector } from "../../store/selectors";
import CalendarSelector from "../CalendarSelector";

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

const Content = ({ isDashboard, isGoogleAccount, calendars, calendarId, onSetCalendar, language, onSetLanguage, clockType, onSetClockType }) => {
  const { isCurrentStep, isTransitioning } = useWizard();

  const calendarSelector = (
    <>
      <Text large block>
        {isDashboard ? 'Calendars' : 'Calendar'}
      </Text>
      <CalendarSelector
        instanceId="connect-device-choose-calendar"
        isMulti={isDashboard}
        value={calendarId}
        options={calendars}
        onChange={onSetCalendar}
        styles={{ container: base => ({ ...base, marginTop: 15, marginBottom: 10 }) }}
        menuPortalTarget={document.body}
        autofocus={isCurrentStep && !isTransitioning}
        tabIndex={isCurrentStep ? 0 : -1}
      />
      {isGoogleAccount && (
        <Button link
                href="https://go.roombelt.com/scMpEB"
                target="_blank"
                tabIndex={isCurrentStep ? 0 : -1}
                style={{ padding: "5px 3px" }}>
          Why is my calendar read-only or absent?
        </Button>
      )}
    </>
  );

  const languageSelector = (
    <>
      <Text large block style={{ marginTop: 15, marginBottom: 10 }}>Locale</Text>
      <LocaleWrapper>
        <Select
          instanceId="edit-device-choose-language"
          value={language}
          options={Object.values(translations)}
          getOptionLabel={lang => lang.language}
          getOptionValue={lang => lang.key}
          onChange={translation => onSetLanguage && onSetLanguage(translation && translation.key)}
          menuPortalTarget={document.body}
          tabIndex={isCurrentStep ? 0 : -1}
        />
        <Select
          instanceId="edit-device-choose-clock"
          value={clockType}
          options={[{ label: "12h clock", value: 12 }, { label: "24h clock", value: 24 }]}
          menuPortalTarget={document.body}
          tabIndex={isCurrentStep ? 0 : -1}
          onChange={option => onSetClockType && onSetClockType(option && option.value)}
        />
      </LocaleWrapper>
    </>
  );

  return (
    <WizardStepLayout img={require("./calendar.png")}>
      {calendarSelector}
      {languageSelector}
    </WizardStepLayout>
  );
};

const Buttons = ({ onSubmit, onBack, onShowAdvancedConfiguration, submitButton }) => (
  <div>
    <LoaderButton link
                  onClick={onShowAdvancedConfiguration}
                  isLoading={submitButton === "show-advanced"}
                  disabled={!!submitButton}>
      Advanced configuration
    </LoaderButton>
    <Button disabled={!!submitButton} onClick={onBack}>Back</Button>
    <LoaderButton primary onClick={onSubmit} disabled={!!submitButton}
                  isLoading={submitButton === "voila"}>Voila</LoaderButton>
  </div>
);

const mapStateToProps = state => ({
  calendars: state.calendars,
  isDashboard: state.connectDeviceWizard.deviceType === "dashboard",
  submitButton: state.connectDeviceWizard.submitButton,
  calendarId: state.connectDeviceWizard.calendarId,
  language: state.connectDeviceWizard.language,
  clockType: state.connectDeviceWizard.clockType,
  showAvailableRooms: state.connectDeviceWizard.showAvailableRooms,
  isGoogleAccount: isGoogleAccountSelector(state)
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(connectDeviceWizardActions.thirdStep.previousStep()),
  onSubmit: () => dispatch(connectDeviceWizardActions.submit("voila")),
  onSetCalendar: calendarId => dispatch(connectDeviceWizardActions.thirdStep.setCalendarId(calendarId)),
  onSetLanguage: language => dispatch(connectDeviceWizardActions.thirdStep.setLanguage(language)),
  onSetClockType: clockType => dispatch(connectDeviceWizardActions.thirdStep.setClockType(clockType)),
  onShowAdvancedConfiguration: () => dispatch(connectDeviceWizardActions.submit("show-advanced", true))
});

export default {
  key: "configuration",
  name: "Configure",
  content: connect(mapStateToProps, mapDispatchToProps)(Content),
  buttons: connect(mapStateToProps, mapDispatchToProps)(Buttons)
};
