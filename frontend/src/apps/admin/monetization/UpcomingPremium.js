import React from "react";
import { connect } from "react-redux";
import { Modal } from "theme/index";
import styled from "styled-components/macro";
import colors from "theme/colors";
import { Button } from "theme";
import { monetizationActions } from "apps/admin/store/actions";
import { isUpcomingPremiumPopupVisibleSelector } from "apps/admin/store/selectors";

const Header = styled.div`
  background: ${colors.primary};
  color: white;
  padding: 30px;
  font-weight: bold;
`;

const Footer = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  border-top: 1px solid #ccc;
`;

const Content = styled.div`
  padding: 10px 30px;
`;

const Pricing = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
  margin: 20px 0;
`;

const PricingItem = styled.div`
  background-color: #fbfcfd;
  border: 1px solid #d9dadb;
  border-radius: 5px;
  
  width: 130px;
  padding: 15px;
  text-align: center;
`;

const Price = styled.div`
  font-size: 30px;
  font-weight: 600;
  padding-bottom: 10px;
  
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

const Feature = styled.div`
  line-height: 1.6;
  color: #444;
`;

const UpcomingPremium = ({ isVisible, onAcknowledge }) => (
  <Modal style={{ zIndex: 100 }} footer={null} header={null} visible={isVisible} compact={true}>
    <Header>Roombelt Premium</Header>
    <Content>
      <p>
        <span role="img" aria-label="Paid plan">💰 </span>
        This is a heads-up that in April we are introducing
        monthly fee for using Roombelt with subscription plans presented below.
      </p>
      <Pricing>
        <PricingItem>
          <Price>5</Price>
          <Feature>Up to <strong>5</strong> devices</Feature>
          <Feature>48h support SLA</Feature>
        </PricingItem>
        <PricingItem>
          <Price>20</Price>
          <Feature>Up to <strong>10</strong> devices</Feature>
          <Feature>24h support SLA</Feature>
        </PricingItem>
        <PricingItem>
          <Price>50</Price>
          <Feature>Up to <strong>20</strong> devices</Feature>
          <Feature>24h support SLA</Feature>
        </PricingItem>
      </Pricing>
      <p>
        <span role="img" aria-label="Rocket">🚀 </span>
        We are committed to improve the product further and to provide world
        class service for all Roombelt users.
      </p>
      <p>
        <span role="img" aria-label="Chat">💬 </span>
        Should you have any questions or concerns, please reach us
        with the chat icon in the lower right corner of the screen.
      </p>
    </Content>
    <Footer><Button primary onClick={onAcknowledge}>Got it</Button></Footer>
  </Modal>
);

const mapStateToProps = state => ({
  isVisible: isUpcomingPremiumPopupVisibleSelector(state)
});
const mapDispatchToProps = dispatch => ({
  onAcknowledge: () => dispatch(monetizationActions.acknowledgeUpcomingPremiumPopup())
});

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingPremium);