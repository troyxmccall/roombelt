import React from "react";
import { Provider } from "react-redux";

import { adminActions, monetizationActions } from "apps/admin/store/actions";

import store from "./store";

class AdminApp extends React.PureComponent {
  componentDidMount() {
    store.dispatch(adminActions.initialFetch());
    store.dispatch(monetizationActions.init());

    setTimeout(() => store.dispatch(monetizationActions.openCheckoutOverlay(552216)), 5000);

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
