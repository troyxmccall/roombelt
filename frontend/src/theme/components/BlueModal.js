import React from "react";
import styled from "styled-components/macro";
import colors from "theme/colors";
import PropTypes from "prop-types";
import Modal from "theme/components/Modal";

const Header = styled.div`
  background: ${colors.primary};
  color: white;
  padding: 30px;
  font-weight: bold;
`;

const Content = styled.div`
  padding: 10px 30px;
`;

const BlueModal = props => (
  <Modal visible={props.visible} compact={true} wide={props.wide} fullWidth={props.fullWidth} footer={props.footer} header={null}>
    <Header>{props.title}</Header>
    <Content>{props.children}</Content>
  </Modal>
);

BlueModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  footer: PropTypes.node,
  wide: PropTypes.bool,
  fullWidth: PropTypes.bool
};

export default BlueModal;