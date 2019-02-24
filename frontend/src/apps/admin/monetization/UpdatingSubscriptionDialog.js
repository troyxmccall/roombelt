import React from "react";
import { connect } from "react-redux";

import { BlueModal, Loader } from "theme";
import { isUpdatingSubscriptionDialogOpen } from "apps/admin/store/selectors";

const UpdatingSubscriptionDialog = ({ isOpen }) => {
  return (
    <BlueModal title={"Updating subscription"}
               footer={null}
               visible={isOpen}>
      <div style={{ textAlign: "center", margin: 20 }}>
        <Loader/>
      </div>
    </BlueModal>
  );
};

const mapStateToProps = state => ({
  isOpen: isUpdatingSubscriptionDialogOpen(state)
});

export default connect(mapStateToProps)(UpdatingSubscriptionDialog);