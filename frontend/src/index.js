import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import i18n from "./i18n";
import "./fonts";
import "./index.css";

i18n().then(() => {
  ReactDOM.render(<BrowserRouter children={<Router/>}/>, document.querySelector("#root"));
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
}
