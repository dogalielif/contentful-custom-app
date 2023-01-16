import React from "react";
import { render } from "react-dom";

import {
  init,
  locations,
} from "@contentful/app-sdk";
import "@contentful/forma-36-react-components/dist/styles.css";
import "@contentful/forma-36-fcss/dist/styles.css";
import "@contentful/forma-36-tokens/dist/css/index.css";
import "./index.css";
import { SDKProvider } from "@contentful/react-apps-toolkit";

import Field from "./components/Field";

import LocalhostWarning from "./components/LocalhostWarning";
// import ConfigScreen from "./components/ConfigScreen";

if (process.env.NODE_ENV === "development" && window.self === window.top) {
  // You can remove this if block before deploying your app
  const root = document.getElementById("root");
  render(<LocalhostWarning />, root);
} else {
  init((sdk) => {
    const root = document.getElementById("root");

    // All possible locations for your app
    // Feel free to remove unused locations
    // Dont forget to delete the corresponding file too :)
    const ComponentLocationSettings = [
      {
        location: locations.LOCATION_ENTRY_FIELD,
        component: <SDKProvider><Field /></SDKProvider>,
      }
      // {
      //   location: locations.LOCATION_APP_CONFIG,
      //   component: <SDKProvider><ConfigScreen /></SDKProvider>,
      // }
    ];

    // Select a component depending on a location in which the app is rendered.
    ComponentLocationSettings.forEach((componentLocationSetting) => {
      if (sdk.location.is(componentLocationSetting.location)) {
        render(componentLocationSetting.component, root);
      }
    });
  });
}
