import React from "react";
import { connect } from "react-redux";
import { Card, BlueModal } from "theme/index";
import styled from "styled-components/macro";
import { Button } from "theme";
import premiumPlans from "services/premium-plans";

import {
  connectedDevicesSelector,
  daysOfTrialLeftSelector,
  isChoosePlanDialogOpenSelector,
  currentSubscriptionPlanSelector
} from "apps/admin/store/selectors";

import { monetizationActions } from "apps/admin/store/actions";


const Pricing = styled.div`
  display: flex;
  width: 100%;
  justify-content: stretch;
  align-items: stretch;
  margin: 20px 0;
`;

const PricingCard = styled(Card)`
  flex-grow: 1;
  text-align: center;
  user-select: none;
  background: #fefefe;
  
  :not(:last-child) {
    margin-right: 20px;
  }
  
  :hover {
    box-shadow: 0 0 3px 1px #ccc;
  }
`;

const Price = styled.div`
  font-size: 30px;
  font-weight: 600;
  padding-bottom: 10px;
  text-align: center;
  
  :before {
    font-size: 15px;
    vertical-align: super;
    font-weight: normal;
    content: '$';
  }
  
  :after {
    font-size: 13px;
    vertical-align: baseline;
    color: #555;
    font-weight: normal;
    content: ' /mo';
  }
`;

const PlanName = styled.div`
  font-size: 0.875rem;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: .05em;
  margin-bottom: 15px;
  
  :after {
    content: '${props => props.current ? " (current)" : ""}';
  }
`;

const Feature = styled.div`
  line-height: 1.6;
  color: #444;
`;

const ChoosePlan = styled(Button)`
  margin-top: 10px;
`;

const ChoosePlanDialog = ({ isOpen, connectedDevices, daysOfTrialLeft, subscriptionPlan, close, selectPlan, updateSubscription, cancelSubscription }) => {
  const isStarterCurrent = subscriptionPlan === premiumPlans.STARTER;
  const isGrowingCurrent = subscriptionPlan === premiumPlans.GROWING;
  const isBusinessCurrent = subscriptionPlan === premiumPlans.BUSINESS;

  const isStarterHighlighted = connectedDevices <= 5 && !isGrowingCurrent && !isBusinessCurrent;
  const isGrowingHighlighted = connectedDevices > 5 && connectedDevices <= 10 && !isBusinessCurrent;
  const isBusinessHighlighted = connectedDevices > 10;

  const isTrialActive = daysOfTrialLeft > 0;
  const isCurrentPlanSufficient = isTrialActive || (subscriptionPlan && subscriptionPlan.maxDevices >= connectedDevices);
  const showFooter = subscriptionPlan || isCurrentPlanSufficient;

  const footer = (
    <>
      {subscriptionPlan && <Button onClick={cancelSubscription} link>Cancel subscription</Button>}
      <div style={{ flexGrow: 1 }}/>
      {subscriptionPlan && <Button onClick={updateSubscription} secondary>Update payment method</Button>}
      {isCurrentPlanSufficient && <Button primary onClick={close}>Close</Button>}
    </>
  );

  const trialInfo = `Your free trial ends in ${daysOfTrialLeft} days. If you are happy with the product you can end the trial now and start subscription below.`;
  const endOfTrialInfo = "Your free trial is over. Choose one of the subscription plans below.";
  const paidInfo = `You are currently on the ${subscriptionPlan && subscriptionPlan.name} plan which allows you to connect up to ${subscriptionPlan && subscriptionPlan.maxDevices} devices. You can change the plan below.`;
  const needsUpgradeInfo = `You connected more devices than allowed in your current plan. Change the subscription plan below.`;

  return (
    <BlueModal footer={showFooter ? footer : null} visible={isOpen} wide={true} title={"Roombelt subscription"}>
      <p>
        {!subscriptionPlan && isTrialActive && trialInfo}
        {!subscriptionPlan && !isTrialActive && endOfTrialInfo}
        {subscriptionPlan && isCurrentPlanSufficient && paidInfo}
        {subscriptionPlan && !isCurrentPlanSufficient && needsUpgradeInfo}
      </p>
      <Pricing>
        <PricingCard>
          <PlanName current={isStarterCurrent}>Starter</PlanName>
          <Price>5</Price>
          <Feature>Up to 5 devices</Feature>
          <Feature>48h support SLA</Feature>
          <ChoosePlan disabled={isStarterCurrent || connectedDevices > 5}
                      success={isStarterHighlighted}
                      secondary={!isStarterHighlighted}
                      onClick={() => selectPlan(premiumPlans.STARTER.subscriptionPlanId)}>
            Choose plan
          </ChoosePlan>
        </PricingCard>
        <PricingCard>
          <PlanName current={isGrowingCurrent}>Growing</PlanName>
          <Price>20</Price>
          <Feature>Up to 10 devices</Feature>
          <Feature>24h support SLA</Feature>
          <ChoosePlan disabled={isGrowingCurrent || connectedDevices > 10}
                      success={isGrowingHighlighted}
                      secondary={!isGrowingHighlighted}
                      onClick={() => selectPlan(premiumPlans.GROWING.subscriptionPlanId)}>
            Choose plan
          </ChoosePlan>
        </PricingCard>
        <PricingCard>
          <PlanName current={isBusinessCurrent}>Business</PlanName>
          <Price>50</Price>
          <Feature>Up to 20 devices</Feature>
          <Feature>24h support SLA</Feature>
          <ChoosePlan disabled={isBusinessCurrent}
                      success={isBusinessHighlighted}
                      secondary={!isBusinessHighlighted}
                      onClick={() => selectPlan(premiumPlans.BUSINESS.subscriptionPlanId)}>
            Choose plan
          </ChoosePlan>
        </PricingCard>
      </Pricing>
    </BlueModal>
  );
};

const mapStateToProps = state => ({
  isOpen: isChoosePlanDialogOpenSelector(state),
  daysOfTrialLeft: daysOfTrialLeftSelector(state),
  subscriptionPlan: currentSubscriptionPlanSelector(state),
  connectedDevices: connectedDevicesSelector(state).length
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(monetizationActions.closePlanDialog()),
  selectPlan: (planId) => dispatch(monetizationActions.selectSubscriptionPlan(planId)),
  updateSubscription: () => dispatch(monetizationActions.openUpdateSubscriptionOverlay()),
  cancelSubscription: () => dispatch(monetizationActions.openCancelSubscriptionDialog())
});

export default connect(mapStateToProps, mapDispatchToProps)(ChoosePlanDialog);