import MapView from "esri/views/MapView";
import React from "react";

export class WebMapComponent extends React.Component {
  componentDidMount() {
    const view = new MapView({
      map: this.props.webmap,
      container: this.mapDiv,
    });
    this.props.onload(view);
  }

  render() {
    return (
      <div className="webmap" ref={(element) => (this.mapDiv = element)}></div>
    );
  }
}
