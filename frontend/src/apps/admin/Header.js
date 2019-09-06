import React from "react";
import styled from "styled-components/macro";
import { connect } from "react-redux";

import Logo from "../Logo";
import { DropdownMenu, DropdownMenuItem, Text } from "theme";
import { monetizationActions } from "apps/admin/store/actions";
import { isOnPremisesSelector, currentSubscriptionPlanSelector, daysOfTrialLeftSelector } from "apps/admin/store/selectors";

const User = styled.a`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 2px;
`;

const UserAvatar = styled.span`
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-size: contain;
  margin-right: 10px;
  grid-area: user-avatar;
  ${props => props.img && `background-image: url(${props.img});`};
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Header = props => {
  const user = (
    <User>
      <UserAvatar img={props.avatarUrl}/>
      <div>
        <Text block small>
          {props.userName}
        </Text>
        <Text block xsmall muted>
          {props.currentSubscriptionPlan && `Roombelt ${props.currentSubscriptionPlan.name}`}
          {!props.currentSubscriptionPlan && "Free trial"}
          {!props.currentSubscriptionPlan && props.daysOfTrialLeft >= 0 && ` - ${props.daysOfTrialLeft} days left`}
        </Text>
      </div>
    </User>
  );

  return (
    <Wrapper>
      <a href="https://roombelt.com" style={{ textDecoration: "none" }}>
        <Logo size={24} withName/>
      </a>

      <DropdownMenu trigger={user} arrowPosition="left: 10px">
        {!props.isOnPremises && (
          <DropdownMenuItem onClick={props.openChoosePlanDialog}>Subscription settings</DropdownMenuItem>
        )}
        <DropdownMenuItem as="a" href="https://docs.roombelt.com">
          Help
        </DropdownMenuItem>
        <DropdownMenuItem as="a" href="/api/admin/logout">
          Log out
        </DropdownMenuItem>
      </DropdownMenu>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  avatarUrl: state.user.avatarUrl,
  userName: state.user.displayName,
  daysOfTrialLeft: daysOfTrialLeftSelector(state),
  currentSubscriptionPlan: currentSubscriptionPlanSelector(state),
  isOnPremises: isOnPremisesSelector(state)
});

const mapDispatchToProps = dispatch => ({
  openChoosePlanDialog: () => dispatch(monetizationActions.openPlanDialog())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
