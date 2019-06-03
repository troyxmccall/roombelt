import React from "react";
import { connect } from "react-redux";
import { BlueModal } from "theme/index";
import { Button } from "theme";
import {
  daysSinceJoinedSelector,
  isOnPremisesEvaluationExpiredDialogOpenSelector,
  isOnPremisesPaidPlan
} from "../store/selectors";
import { monetizationActions } from "../store/actions";

const ChoosePlanDialog = ({ isOpen, isOnPaidPlan, daysSinceEvaluationStarted, close, continueEvaluation, buyLicense }) => {
  if (isOnPaidPlan) {
    return (
      <BlueModal visible={isOpen} footer={<Button onClick={close} primary>Close</Button>} title="Roombelt license">
        <p>
          You are on a paid subscription plan.
          Reach the <Button link style={{ padding: 0 }} href="mailto: mateusz@roombelt.com">support team</Button> if you
          want to modify your subscription.
        </p>
      </BlueModal>
    );
  }

  if (daysSinceEvaluationStarted === 0) {
    const footer = (
      <>
        <Button onClick={buyLicense} link>Start subscription</Button>
        <Button onClick={continueEvaluation} success>Close</Button>
      </>
    );

    return (
      <BlueModal visible={isOpen} footer={footer} title="Roombelt license">
        <p>
          Thanks for giving Roombelt a try! It's a free software but keep
          in mind that you can support further development by starting a paid subscription.
        </p>
      </BlueModal>
    );
  }

  const footer = (
    <>
      <Button onClick={continueEvaluation} link>Close</Button>
      <Button onClick={buyLicense} success>Start subscription</Button>
    </>
  );

  return (
    <BlueModal footer={footer} visible={isOpen} title={"Roombelt license"}>
      <p>
        You are using Roombelt for {daysSinceEvaluationStarted} days now.
        It's a free software but keep in mind that you can support further
        development by starting a paid subscription.
      </p>
    </BlueModal>
  );
};

const mapStateToProps = state => ({
  isOpen: isOnPremisesEvaluationExpiredDialogOpenSelector(state),
  isOnPaidPlan: isOnPremisesPaidPlan(state),
  daysSinceEvaluationStarted: daysSinceJoinedSelector(state)
});

const mapDispatchToProps = dispatch => ({
  continueEvaluation: () => dispatch(monetizationActions.extendOnPremisesEvaluation()),
  buyLicense: () => dispatch(monetizationActions.buyOnPremises()),
  close: () => dispatch(monetizationActions.closePlanDialog())
});

export default connect(mapStateToProps, mapDispatchToProps)(ChoosePlanDialog);