import React from "react";
import i18next from "i18next";
import { withRouter } from "react-router";
import { Route, Switch } from "react-router-dom";

import FatalError from "./theme/layouts/FatalError";
import LoginApp from "./apps/login/Login";
import AdminApp from "./apps/admin";
import DeviceApp from "./apps/device";
import { isOnline } from "services/api";

class Router extends React.PureComponent {
  state = { isConfirmedOnline: false, hasFirstOnlineCheckBeenDone: false };

  async componentDidMount() {
    while (!await isOnline()) {
      this.setState({ hasFirstOnlineCheckBeenDone: true });
      await new Promise(res => setTimeout(res, 5000));
    }

    this.setState({ hasFirstOnlineCheckBeenDone: true, isConfirmedOnline: true });
  }

  render() {
    if (!this.state.hasFirstOnlineCheckBeenDone) {
      return null;
    }

    if (!this.state.isConfirmedOnline) {
      return <FatalError title={i18next.t("errors.unable-to-connect-server")}
                         message={i18next.t("errors.check-internet-and-try-again")}/>;
    }

    return (
      <Switch>
        <Route exact path={"/device/:sessionToken?"} component={DeviceApp}/>
        <Route exact path={"/admin"} component={AdminApp}/>
        <Route component={LoginApp}/>
      </Switch>
    );
  }
}

export default withRouter(Router);
