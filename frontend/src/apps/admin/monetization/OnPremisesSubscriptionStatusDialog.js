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

  const footer = (
    <>
      <Button onClick={continueEvaluation} link>Continue evaluation</Button>
      <Button onClick={buyLicense} success>Buy license</Button>
    </>
  );

  return (
    <BlueModal footer={footer} visible={isOpen} title={"Roombelt license"}>
      <p>
        You are evaluating Roombelt for {daysSinceEvaluationStarted} days now.
        Roombelt can be evaluated for free as long as necessary to try the product,
        however, a license must be purchased for continued use.
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