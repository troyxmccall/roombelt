import React from "react";
import { Modal } from "theme/index";
import styled from "styled-components/macro";
import colors from "theme/colors";
import { Button } from "theme";

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
  padding: 30px;
`;

export default () => (
  <Modal style={{ zIndex: 100 }} footer={null} header={null} visible={true} compact={true} wide>
    <Header>Roombelt Premium</Header>
    <Content>

      Roombelt will soon introduce paid plans
    </Content>
    <Footer><Button primary>Got it</Button></Footer>
  </Modal>
)

