// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "<h4> Place: " +
      feature.properties.place +
      "</h4>"  + 
      "<h4> Magnitude: " + 
      feature.properties.mag + 
      "</h4>" +
      "<h4>" + 
      new Date(feature.properties.mag) + 
      "</h4>"
      );
  }

  function QuakeColor(Qcolor) {
    switch(true) {
        case (0 <= Qcolor && Qcolor <= 1.0):
          return "#ffe1e1";
        case (1.0 <= Qcolor && Qcolor <= 2.0):
            return "#ff9999";
        case (2.0 <= Qcolor && Qcolor<= 3.0):
          return "#ff4848";
        case (3.0 <= Qcolor && Qcolor<= 4.0):
            return "#fe1414";
        case (4.0 <= Qcolor && Qcolor<= 5.0):
            return "#d70101";
        case (5.0 <= Qcolor && Qcolor <= 6.0):
          return "#a10101";
        default:
          return "#800202";
    }
  }

  function CircleMaker(features, latlng){
    var CircleOptions = {
        radius: features.properties.mag *5,
        fillColor: QuakeColor(features.geometry.coordinates[2]),
        color: QuakeColor(features.geometry.coordinates[2]),
        opacity: 1.0,
        fillOpacity: .75

    }
    return L.circleMarker(latlng, CircleOptions)

};

// create function to provide colors for legend

function getColors(Qcolor) {
    if (Qcolor < 1){
      return "#ffe1e1"
    }
    else if ( Qcolor < 2){
      return "#ff9999"
    }
    else if (Qcolor < 3){
      return "#ff4848"
    }
    else if (Qcolor < 4){
      return "#fe1414"
    }
    else if (Qcolor < 5 ){
      return "#d70101"
    }
    else if (Qcolor < 6 ){
        return "#a10101"
      }
    else {
      return "#800202"
    }
    };



    


  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature, 
    pointToLayer: CircleMaker
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.00, -110.00
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
  
 


}