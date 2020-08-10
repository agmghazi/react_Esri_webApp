import "./config";

import FeatureLayer from "esri/layers/FeatureLayer";
import MapImageLayer from "esri/layers/MapImageLayer";

import Map from "esri/Map";

import React from "react";
import ReactDOM from "react-dom";

import { Header } from "./components/header";
import { WebMapComponent } from "./components/webmapview";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import "./css/main.scss";

const layer = new GraphicsLayer();
const addDOMNode = () => {
  const appNode = document.createElement("div");
  appNode.id = "app";
  document.body.appendChild(appNode);
  return appNode;
};

const onComponentLoad = (view) => {
  MapImage2.when(() => {
    view.goTo({ target: MapImage2.fullExtent });
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
  layers: [layer],
});
console.log(map1);

const MapImage2 = new MapImageLayer({
  url: "http://localhost:6080/arcgis/rest/services/DataWorker/MapServer",
  sublayers: [
    {
      id: 2,
      popupTemplate: {
        title: "ahmed2",
        content: " people lived in this county in 2007",
      },
    },
  ],
});
const MapImage1 = new MapImageLayer({
  url: "http://localhost:6080/arcgis/rest/services/DataWorker/MapServer",
  sublayers: [
    {
      id: 1,
      popupTemplate: {
        title: "ahmed1",
        content: "people lived in this county in 2007",
      },
    },
  ],
});
const MapImage3 = new MapImageLayer({
  url: "http://localhost:6080/arcgis/rest/services/DataWorker/MapServer",
  sublayers: [
    {
      id: 3,
      popupTemplate: {
        title: "ahmed3",
        content: "people lived in this county in 2007",
      },
    },
  ],
});
const MapImage4 = new MapImageLayer({
  url: "http://localhost:6080/arcgis/rest/services/DataWorker/MapServer",
  sublayers: [
    {
      id: 4,
      popupTemplate: {
        title: "ahmed4",
        content: "people lived in this county in 2007",
      },
    },
  ],
});
const MapImage5 = new MapImageLayer({
  url: "http://localhost:6080/arcgis/rest/services/DataWorker/MapServer",
  sublayers: [
    {
      id: 5,
      popupTemplate: {
        title: "ahmed5",
        content: "people lived in this county in 2007",
      },
    },
  ],
});
map1.addMany([MapImage2, MapImage3, MapImage4, MapImage5, MapImage1]);

/**
 * React portion of application
 * <Header appName="لوزاره الرياضة" />
 */
ReactDOM.render(
  <div className="main">
    <WebMapComponent webmap={map1} layer={layer} onload={onComponentLoad} />
  </div>,
  addDOMNode()
);
