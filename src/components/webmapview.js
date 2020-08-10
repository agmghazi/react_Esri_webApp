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

// import watchUtils from "esri/core/watchUtils";
import * as watchUtils from "arcgis-js-api/core/watchUtils";
// OR
// import { whenTrue, whenFalse } from 'arcgis-js-api/core/watchUtils';

import Draw from "esri/views/2d/draw/Draw";
import Extent from "esri/geometry/Extent";
import Graphic from "esri/Graphic";

var _prevExtent,
  _preExtent,
  _currentExtent,
  _extentHistory,
  evtViewDragHandler,
  evtViewKeyDownHandler,
  draw,
  fullExtent,
  _nextExtent,
  _extentHistoryIndx;
var view;
export class WebMapComponent extends React.Component {
  componentDidMount() {
    view = new MapView({
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

    // to run pure javascript in component
    // const script = document.createElement("script");
    // script.src = "./src/components/cDom.js";
    // script.async = true;
    // document.body.appendChild(script);
    // OR
    // appendScript("./src/components/cDom.js");

    //add Navigation Toolbar
    _prevExtent = false;
    _preExtent = null;
    _currentExtent = null;
    _extentHistory = [];
    _extentHistoryIndx = 0;
    _nextExtent = false;
    _prevExtent = false;
    _preExtent = null;
    _currentExtent = null;
    _extentHistory = [];
    _extentHistoryIndx = 0;
    _nextExtent = false;

    watchUtils.whenTrue(view, "ready", function () {
      fullExtent = view.extent.clone();
      draw = new Draw({
        view: view,
      });
      initToolbar();
      watchUtils.whenOnce(view, "extent", function () {
        watchUtils.when(view, "stationary", function (evt) {
          if (evt) {
            extentChangeHandler(view.extent);
          }
        });
      });
    });
    function extentChangeHandler(evt) {
      if (_prevExtent || _nextExtent) {
        _currentExtent = evt;
      } else {
        _preExtent = _currentExtent;
        _currentExtent = evt;
        _extentHistory.push({
          preExtent: _preExtent,
          currentExtent: _currentExtent,
        });
        _extentHistoryIndx = _extentHistory.length - 1;
      }
      _prevExtent = _nextExtent = false;
      extentHistoryChange();
    }
    function extentHistoryChange() {
      if (_extentHistory.length === 0 || _extentHistoryIndx === 0) {
        let elementAdd = document.getElementById("zoomprev");
        elementAdd.classList.add("disabled");
      } else {
        let elementRemove = document.getElementById("zoomprev");
        elementRemove.classList.remove("disabled");
      }
      if (
        _extentHistory.length === 0 ||
        _extentHistoryIndx === _extentHistory.length - 1
      ) {
        let elementAdds = document.getElementById("zoomnext");
        elementAdds.classList.add("disabled");
      } else {
        let elementRemoves = document.getElementById("zoomnext");
        elementRemoves.classList.remove("disabled");
      }
    }
    function enableViewPanning() {
      if (evtViewDragHandler) {
        evtViewDragHandler.remove();
        evtViewDragHandler = null;
      }
      if (evtViewKeyDownHandler) {
        evtViewKeyDownHandler.remove();
        evtViewKeyDownHandler = null;
      }
    }
    function disableViewPanning() {
      if (evtViewDragHandler) {
        evtViewDragHandler.remove();
        evtViewDragHandler = null;
      }
      if (evtViewKeyDownHandler) {
        evtViewKeyDownHandler.remove();
        evtViewKeyDownHandler = null;
      }
      evtViewDragHandler = view.on("drag", function (event) {
        // prevents panning with the mouse drag event
        event.stopPropagation();
      });
      evtViewKeyDownHandler = view.on("key-down", function (event) {
        // prevents panning with the arrow keys
        var keyPressed = event.key;
        if (keyPressed.slice(0, 5) === "Arrow") {
          event.stopPropagation();
        }
      });
    }
    function displayCrosshairCursor() {
      view &&
        view.container &&
        view.container.style &&
        "crosshair" !== view.container.style.cursor &&
        (view.container.style.cursor = "crosshair");
    }
    function displayPointerCursor() {
      view &&
        view.container &&
        view.container.style &&
        "pointer" !== view.container.style.cursor &&
        (view.container.style.cursor = "pointer");
    }
    function displayDefaultCursor() {
      view &&
        view.container &&
        view.container.style &&
        "default" !== view.container.style.cursor &&
        (view.container.style.cursor = "default");
    }
    function removeCurrentSelTool() {
      view.popup.close();
      let panmaplements = document.getElementById("panmap");
      panmaplements.classList.remove("selected");
      let zoominlements = document.getElementById("zoomin");
      zoominlements.classList.remove("selected");
      let zoomoutlements = document.getElementById("zoomout");
      zoomoutlements.classList.remove("selected");
    }
    function drawRect(event) {
      var vertices = event.vertices;
      //remove existing graphic
      view.graphics.removeAll();
      if (vertices.length < 2) {
        return;
      }
      // create a new extent
      var extent = getExtentfromVertices(vertices);
      var graphic = new Graphic({
        geometry: extent,
        symbol: {
          type: "simple-fill", // autocasts as SimpleFillSymbol
          color: [0, 0, 0, 0.3],
          style: "solid",
          outline: {
            // autocasts as SimpleLineSymbol
            color: [255, 0, 0],
            width: 1,
          },
        },
      });
      view.graphics.add(graphic);
    }
    function zoomIn(evt) {
      draw.reset();
      view.graphics.removeAll();
      var action = draw.create("rectangle");
      view.focus();
      action.on("vertex-add", drawRect);
      action.on("draw-complete", zoomIn);
      action.on("cursor-update", drawRect);
      if (evt.vertices.length === 1) {
        view.goTo({ scale: view.scale * 0.5 });
        return;
      }
      var extent = getExtentfromVertices(evt.vertices);
      if (extent.width !== 0 || extent.height !== 0) {
        view.goTo(extent);
      }
    }
    function zoomOut(evt) {
      var vertices = evt.vertices;
      draw.reset();
      view.graphics.removeAll();
      var action = draw.create("rectangle");
      view.focus();
      action.on("vertex-add", drawRect);
      action.on("draw-complete", zoomOut);
      action.on("cursor-update", drawRect);
      if (evt.vertices.length === 1) {
        view.goTo({ scale: view.scale * 2 });
        return;
      }
      var sx = vertices[0][0],
        sy = vertices[0][1];
      var ex = vertices[1][0],
        ey = vertices[1][1];
      var rect = {
        x: Math.min(sx, ex),
        y: Math.max(sy, ey),
        width: Math.abs(sx - ex),
        height: Math.abs(sy - ey),
        spatialReference: view.spatialReference,
      };
      if (rect.width !== 0 || rect.height !== 0) {
        var scrPnt1 = view.toScreen(rect);
        var scrPnt2 = view.toScreen({
          x: rect.x + rect.width,
          y: rect.y,
          spatialReference: rect.spatialReference,
        });
        var mWidth = view.extent.width;
        var delta =
          ((mWidth * view.width) / Math.abs(scrPnt2.x - scrPnt1.x) - mWidth) /
          2;
        var vExtent = view.extent;
        view.goTo(
          new Extent({
            xmin: vExtent.xmin - delta,
            ymin: vExtent.ymin - delta,
            xmax: vExtent.xmax + delta,
            ymax: vExtent.ymax + delta,
            spatialReference: vExtent.spatialReference,
          })
        );
      }
    }
    function getExtentfromVertices(vertices) {
      var sx = vertices[0][0],
        sy = vertices[0][1];
      var ex = vertices[1][0],
        ey = vertices[1][1];
      var rect = {
        x: Math.min(sx, ex),
        y: Math.max(sy, ey),
        width: Math.abs(sx - ex),
        height: Math.abs(sy - ey),
        spatialReference: view.spatialReference,
      };
      if (rect.width !== 0 || rect.height !== 0) {
        return new Extent({
          xmin: parseFloat(rect.x),
          ymin: parseFloat(rect.y) - parseFloat(rect.height),
          xmax: parseFloat(rect.x) + parseFloat(rect.width),
          ymax: parseFloat(rect.y),
          spatialReference: rect.spatialReference,
        });
      } else {
        return null;
      }
    }
    function initToolbar() {
      document
        .getElementById("zoomfull")
        .addEventListener("click", function () {
          view.goTo(fullExtent);
        });
      document
        .getElementById("zoomnext")
        .addEventListener("click", function () {
          _nextExtent = true;
          _extentHistoryIndx++;
          view.goTo(_extentHistory[_extentHistoryIndx].currentExtent);
        });
      document
        .getElementById("zoomprev")
        .addEventListener("click", function () {
          if (_extentHistory[_extentHistoryIndx].preExtent) {
            _prevExtent = true;
            view.goTo(_extentHistory[_extentHistoryIndx].preExtent);
            _extentHistoryIndx--;
          }
        });
      document.getElementById("zoomin").addEventListener("click", function () {
        removeCurrentSelTool();
        disableViewPanning();
        view.graphics.removeAll();
        var action = draw.create("rectangle");
        displayCrosshairCursor();
        view.focus();
        action.on("vertex-add", drawRect);
        action.on("draw-complete", zoomIn);
        action.on("cursor-update", drawRect);
        let zoomelement = document.getElementById("zoomin");
        zoomelement.classList.add("selected");
      });
      document.getElementById("zoomout").addEventListener("click", function () {
        removeCurrentSelTool();
        disableViewPanning();
        view.graphics.removeAll();
        var action = draw.create("rectangle");
        displayCrosshairCursor();
        view.focus();
        action.on("vertex-add", drawRect);
        action.on("draw-complete", zoomOut);
        action.on("cursor-update", drawRect);
        let zoomoutlement = document.getElementById("zoomout");
        zoomoutlement.classList.add("selected");
      });
      document.getElementById("panmap").addEventListener("click", function () {
        removeCurrentSelTool();
        enableViewPanning();
        displayDefaultCursor();
        draw.reset();
        let panmaplement = document.getElementById("panmap");
        panmaplement.classList.add("selected");
      });
    }

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
      {
        component: "Navigationtools",
        position: "top-left",
        index: 0,
      },
    ]);
  }
  render() {
    return (
      <React.Fragment>
        <div
          className="webmap"
          ref={(element) => (this.mapDiv = element)}
        ></div>
        <div id="Navigationtools" className="esri-widget">
          <img
            src="./public/images/zoom-in.png"
            alt="Zoom In"
            title="تكبير الخريطة"
            className="Navigationtool"
            id="zoomin"
          />
          <img
            src="./public/images/zoom-out.png"
            alt="Zoom Out"
            title="تصغير الخريطة"
            className="Navigationtool"
            id="zoomout"
          />
          <img
            src="./public/images/drag.png"
            alt="Pan Map"
            title="تحريك الخريطة"
            className="Navigationtool selected"
            id="panmap"
          />
          <img
            src="./public/images/fullExtent.png"
            alt="Full Extent"
            title="الرجوع للموقع الرئيسي"
            className="Navigationtool"
            id="zoomfull"
          />
          <img
            src="./public/images/back.png"
            alt="Back Extent"
            title="رجوع للخلف"
            className="Navigationtool"
            id="zoomprev"
          />
          <img
            src="./public/images/forward.png"
            alt="Forward Extent"
            title="رجوع للأمام"
            className="Navigationtool"
            id="zoomnext"
          />
        </div>
      </React.Fragment>
    );
  }
}
