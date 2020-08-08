/**
 * Converts decimal degrees to degrees minutes seconds.
 *
 * @param dd the decimal degrees value.
 * @param isLng specifies whether the decimal degrees value is a longitude.
 * @return degrees minutes seconds string in the format 49°15'51.35"N
 */
function convertToDms(dd, isLng) {
  var dir = dd < 0 ? (isLng ? "W" : "S") : isLng ? "E" : "N";

  var absDd = Math.abs(dd);
  var deg = absDd | 0;
  var frac = absDd - deg;
  var min = (frac * 60) | 0;
  var sec = frac * 3600 - min * 60;
  // Round it to 2 decimal points.
  sec = Math.round(sec * 100) / 100;
  return deg + "°" + min + "'" + sec + '"' + dir;
}
console.log(convertToDms(26.538453, false));

// esri convert coordinates
import Point from "esri/geometry/Point";
import GeometryService from "esri/tasks/GeometryService";
import ProjectParameters from "esri/tasks/support/ProjectParameters";
import SpatialReference from "esri/geometry/SpatialReference";

let outSR = 4326; // `wkid {number}`
let geometryService = new GeometryService(
  "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
);
let inputpoint = new Point({
  longitude: 26.427356,
  latitude: 50.114608,
});
let projectParams = new ProjectParameters();
projectParams.geometries = [inputpoint];
projectParams.outSpatialReference = new SpatialReference({ wkid: outSR });
console.log(projectParams);
geometryService.project(projectParams, (result) => {
  let outputpoint = result[0]; // outputpoint first element of result array
  console.log("Result x:", outputpoint.x, "y :", outputpoint.y);
});
