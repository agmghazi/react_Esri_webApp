import MapView from "esri/views/MapView";
import React from "react";
import Home from "esri/widgets/Home";
import Compass from "esri/widgets/Compass";
import ScaleBar from "esri/widgets/ScaleBar";
import Expand from "esri/widgets/Expand";
import Sketch from "esri/widgets/Sketch";
import BasemapGallery from "esri/widgets/BasemapGallery";
import AreaMeasurement2D from "esri/widgets/AreaMeasurement2D";
import DistanceMeasurement2D from "esri/widgets/DistanceMeasurement2D";
import CoordinateConversion from "esri/widgets/CoordinateConversion";
import Bookmarks from "esri/widgets/Bookmarks";

export class WebMapComponent extends React.Component {
  componentDidMount() {
    const view = new MapView({
      map: this.props.webmap,
      container: this.mapDiv,
      zoom: 10,
      center: [50.03602559770744, 26.38306796977232], // longitude, latitude
    });
    this.props.onload(view);

    const homeWidget = new Home({
      view: view,
    });
    const compass = new Compass({
      view: view,
    });
    const scaleBar = new ScaleBar({
      view: view,
      unit: "metric",
    });
    const sketch = new Sketch({
      layer: this.props.layer,
      view: view,
      creationMode: "update",
    });
    const sketchExpand = new Expand({
      expandIconClass: "esri-icon-sketch-rectangle",
      label: "أدوات الرسم",
      view: view,
      content: sketch,
      mode: "floating",
    });
    const basemapGallery = new BasemapGallery({
      view: view,
    });
    const basemapExpand = new Expand({
      view: view,
      content: basemapGallery,
      expanded: false,
      label: "الخرائط",
    });
    const AreameasurementWidget = new AreaMeasurement2D({
      view: view,
    });
    const AreameasurementExpand = new Expand({
      expandIconClass: "esri-icon-measure-area",
      label: "قياس مساحات",
      view: view,
      content: AreameasurementWidget,
      mode: "floating",
    });
    const DistanceWidget = new DistanceMeasurement2D({
      view: view,
    });
    const DistanceExpand = new Expand({
      expandIconClass: "esri-icon-measure-line",
      label: "قياس مسافات",
      view: view,
      content: DistanceWidget,
      mode: "floating",
    });
    const CoordinateWidget = new CoordinateConversion({
      view: view,
    });
    const CoordinateExpand = new Expand({
      expandIconClass: "esri-icon-tracking",
      label: "الاحداثيات",
      view: view,
      content: CoordinateWidget,
      mode: "floating",
    });
    const bookmarks = new Bookmarks({
      view: view,
      // allows bookmarks to be added, edited, or deleted
      editingEnabled: true,
      bookmarks: [],
    });
    const BookmarksExpands = new Expand({
      view: view,
      content: bookmarks,
      expanded: false,
    });

    view.ui.add([
      {
        component: homeWidget,
        position: "top-right",
        index: 5,
      },
      {
        component: compass,
        position: "top-right",
        index: 4,
      },
      {
        component: scaleBar,
        position: "bottom-left",
        index: 2,
      },
      {
        component: sketchExpand,
        position: "top-right",
        index: 5,
      },
      {
        component: basemapExpand,
        position: "top-right",
        index: 3,
      },
      {
        component: AreameasurementExpand,
        position: "top-right",
        index: 6,
      },
      {
        component: DistanceExpand,
        position: "top-right",
        index: 5,
      },
      {
        component: CoordinateExpand,
        position: "bottom-right",
        index: 2,
      },
      {
        component: BookmarksExpands,
        position: "top-right",
        index: 2,
      },
    ]);
  }
  render() {
    return (
      <div className="webmap" ref={(element) => (this.mapDiv = element)}></div>
    );
  }
}
