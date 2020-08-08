import "./config";

import FeatureLayer from "esri/layers/FeatureLayer";
import Map from "esri/Map";

import React from "react";
import ReactDOM from "react-dom";

import { Header } from "./components/header";
import { WebMapComponent } from "./components/webmapview";

import "./css/main.scss";

const addDOMNode = () => {
  const appNode = document.createElement("div");
  appNode.id = "app";
  document.body.appendChild(appNode);
  return appNode;
};

const onComponentLoad = (view) => {
  featureLayer.when(() => {
    view.goTo({ target: featureLayer.fullExtent });
  });
};

const featureLayer = new FeatureLayer({
  id: "states",
  url:
    "http://localhost:6080/arcgis/rest/services/DataWorker12/FeatureServer/2",
  outFields: ["Name", "Zone", "Type"],
  title: "U.S. counties",
});

let map1 = new Map({
  basemap: "streets",
  layers: [featureLayer],
});
/**
 * React portion of application
 * <Header appName="لوزاره الرياضة" />
 */
ReactDOM.render(
  <div className="main">
    <WebMapComponent webmap={map1} onload={onComponentLoad} />
  </div>,
  addDOMNode()
);
