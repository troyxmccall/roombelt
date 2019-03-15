import React from "react";
import { Provider } from "react-redux";

import store from "./store";
import { deviceActions } from "./store/actions";
import FullScreenToggle from "./components/FullScreenToggle";

export default class Device extends React.Component {
  componentDidMount() {
    store.dispatch(deviceActions.initialize());

    if (module.hot) {
      module.hot.accept("./router", () => this.forceUpdate());
    }
  }

  render() {
    const Router = require("./router").default;

    return (
      <Provider store={store}>
        <>
          <Router/>
          <FullScreenToggle/>
        </>
      </Provider>
    );
  }
}

