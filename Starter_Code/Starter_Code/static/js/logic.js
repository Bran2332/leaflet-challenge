// Circle color based on magnitude
function getColor(mag) {
  switch(true) {
      case (1.0 <= mag && mag <= 2.5):
        return "#0071BC";
      case (2.5 <= mag && mag <= 5.0):
        return "#35BC00";
      case (5.0 <= mag && mag <= 6.5):
        return "#BCBC00";
      case (6.5 <= mag && mag <= 8.0):
        return "#BC3500";
      case (8.0 <= mag && mag <= 20.0):
        return "#BC0000";
      default:
        return "#E2FFAE";
  }
}


// Create popup message that includes additional information.  Location and Time when clicked.
function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  
  // Define streetmap and topographical layers.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 15,
    zoomOffset: -1
  });
  
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 15
  });
  
  // Define a baseMaps object for our layers.
  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };
  
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap]    
  });
  streetmap.addTo(myMap); 
  // Create a variable for earthquake data
  let earthquakes = new L.LayerGroup();
  
  let overlayMaps = {
    Earthquakes: earthquakes
  };
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  // Perform a get request with the json url
  const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  d3.json(queryUrl).then(function (data) {
    console.log('data:', data)
    console.log(data.features[0].geometry.coordinates[2])
    // Console log to check the data and then send the data.features object to the createFeatures function
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    L.geoJSON(data, {
      style: function (feature) {
        return {
          color: getColor(feature.geometry.coordinates[2])
        }
      },
      pointToLayer: function (feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius:feature.properties.mag*10,
          fillOpacity: 0.50
        });
  
      },
      onEachFeature: popUpMsg
    }).addTo(earthquakes);
  
  
  
    earthquakes.addTo(myMap);
  });
  
  //create legend.
  let legend = L.control({ position: 'bottomright' });
  
  legend.addTo(myMap);