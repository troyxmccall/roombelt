import React, { useState } from "react";

import { connect } from "react-redux";
import { BlueModal, Button, Input } from "theme";

import { monetizationActions } from "apps/admin/store/actions";
import { isCancelSubscriptionDialogOpenSelector } from "apps/admin/store/selectors";


const CancelSubscriptionDialog = ({ isOpen, back, confirm }) => {
  const [inputValue, updateInputValue] = useState("");
  const normalizedInputValue = inputValue.trim().toLowerCase();
  const confirmationString = "cancel subscription";

  const footer = (
    <>
      <Button secondary onClick={back}>Back</Button>
      <Button primary onClick={confirm} disabled={normalizedInputValue !== confirmationString}>
        Cancel subscription
      </Button>
    </>
  );

  return (
    <BlueModal title={"Cancel subscription"}
               footer={footer}
               visible={isOpen}>
      <p>
        In order to cancel subscription please type "{confirmationString}" to the input below.
        After cancelling subscription all connected devices will stop working immediately.
      </p>
      <p>
        <Input placeholder={"cancel subscription"}
               value={inputValue}
               error={normalizedInputValue && normalizedInputValue !== confirmationString}
               onChange={e => updateInputValue(e.target.value)}
               autofocus/>
      </p>
    </BlueModal>
  );
};

const mapStateToProps = state => ({
  isOpen: isCancelSubscriptionDialogOpenSelector(state)
});

const mapDispatchToProps = dispatch => ({
  confirm: () => dispatch(monetizationActions.confirmCancelSubscription()),
  back: () => dispatch(monetizationActions.closeCancelSubscriptionDialog())
});

export default connect(mapStateToProps, mapDispatchToProps)(CancelSubscriptionDialog);