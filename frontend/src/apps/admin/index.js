import React from "react";
import { Provider } from "react-redux";

import { adminActions, monetizationActions } from "apps/admin/store/actions";
import { getUserDetails } from "services/api";

import store from "./store";

class AdminApp extends React.PureComponent {
  componentDidMount() {
    getUserDetails().then(null, () => window.location = "/");

    store.dispatch(adminActions.initialFetch());
    store.dispatch(monetizationActions.init());

    if (module.hot) {
      module.hot.accept("./Dashboard", () => this.forceUpdate());
    }
  }

  render() {
    const Dashboard = require("./Dashboard").default;

    return (
      <Provider store={store}>
        <Dashboard/>
      </Provider>
    );
  }
}

export default AdminApp;
