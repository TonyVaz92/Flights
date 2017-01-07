var airports = {};

// europe
airports.muc = { name: "Munich", coords: {lat: 48.3538, lng: 11.7861} };
airports.mxp = { name: "Milan Malpensa", coords: {lat: 45.6300, lng: 8.7230} };
airports.txl = { name: "Berlin Tegel", coords: {lat: 52.5597, lng: 13.2877} };
airports.cph = { name: "Copenhagen", coords: {lat: 55.6180, lng: 12.6561} };
airports.fra = { name: "Frankfurt", coords: {lat: 50.0333, lng: 8.5705} };
airports.vce = { name: "Venice Marco Polo", coords: {lat: 45.5052, lng: 12.3519} };
airports.bru = { name: "Brussels", coords: {lat: 50.9013, lng: 4.4844} };
airports.kef = { name: "Reykjavik Keflavik", coords: {lat: 63.9850, lng: -22.6055} };
airports.lgw = { name: "London Gatwick", coords: {lat: 51.1480, lng: -0.1902} };
airports.ist = { name: "Istanbul Ataturk", coords: {lat: 40.9761, lng: 28.8141} };

// usa
airports.den = { name: "Denver", coords: {lat: 39.8561, lng: -104.6737} };
airports.okc = { name: "Oklahoma City", coords: {lat: 35.3930, lng: -97.6008} };
airports.sea = { name: "Seattle-Tacoma", coords: {lat: 47.4488, lng: -122.3094} };
airports.dfw = { name: "Dallas-Fort Worth", coords: {lat: 32.8969, lng: -97.0380} };
airports.iah = { name: "Houston Intercontinental", coords: {lat: 29.9844, lng: -95.3413} };
airports.lax = { name: "Los Angeles", coords: {lat: 33.9416, lng: -118.4085} };
airports.phx = { name: "Phoenix", coords: {lat: 33.4341, lng: -112.0116} };
airports.ord = { name: "Chicago O'Hare", coords: {lat: 41.9786, lng: -87.9047} };
airports.ewr = { name: "Newark", coords: {lat: 40.6925, lng: -74.1686} };
airports.hpn = { name: "Westchester County", coords: {lat: 41.0669, lng: -73.7075} };
airports.mia = { name: "Miami", coords: {lat: 25.7933, lng: -80.2905} };
airports.fll = { name: "Fort Lauderdale", coords: {lat: 26.0725, lng: -80.1527} };
airports.pbi = { name: "Palm Beach", coords: {lat: 26.6832, lng: -80.0956} };
airports.mco = { name: "Orlando", coords: {lat: 28.42944, lng: -81.3088} };

// canada
airports.yyz = { name: "Toronto", coords: {lat: 43.6766, lng: -79.6305} };

// mideast
airports.tlv = { name: "Tel Aviv", coords: {lat: 32.0094, lng: 34.8827} };

// centralamerica
airports.gua = { name: "Guatemala City", coords: {lat: 14.5816, lng: -90.5266} };

// southamerica
airports.uio = { name: "Quito", coords: {lat: -0.1133, lng: -78.3586} };

var map, icon_filled, icon_filled_05, icon_filled_01, flights = [], airport_markers = {};

function newflight(path) {
  var geodesicPoly = new google.maps.Polyline({
    strokeColor: '#990033',
    strokeOpacity: 1.0,
    strokeWeight: 1,
    geodesic: true,
    map: map
  });

  flights.push({path: path, polygon: geodesicPoly});
  geodesicPoly.setPath([airports[path[0]].coords, airports[path[1]].coords]);
}

function newairport(location, id) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    id: id,
    icon: icon_filled_05
  });

  airport_markers[marker.id] = marker;

  google.maps.event.addListener(marker, 'mouseover', function (event) {
    for (var id in airport_markers) {
      airport_markers[id].setIcon(icon_filled_01);
    }

    this.setIcon(icon_filled);
    var this_airport_name = airports[this.id].name;
    var connects = [];

    for (var i=0; i < flights.length; i++) {
      if (this.id == flights[i].path[0]) {
        airport_markers[flights[i].path[1]].setIcon(icon_filled);
        connects.push(airports[flights[i].path[1]].name);
        flights[i].polygon.setOptions({
                strokeOpacity : 1.0
            });
      } else if (this.id == flights[i].path[1]) {
        airport_markers[flights[i].path[0]].setIcon(icon_filled);
        connects.push(airports[flights[i].path[0]].name);
        flights[i].polygon.setOptions({
                strokeOpacity : 1.0
            });
      } else {
        flights[i].polygon.setOptions({
                strokeOpacity : 0.1
            });
      }
    }
    connects.sort();

    var infobox = document.getElementById("infobox");
    infobox.getElementsByTagName("h2")[0].innerHTML = this_airport_name;

    var ul = document.createElement("ul");
    for (var i=0; i < connects.length; i++) {
      var li = document.createElement("li");
      li.innerHTML = connects[i];
      ul.appendChild(li)
    }
    var p = infobox.getElementsByTagName("p")[0];
    while (p.hasChildNodes()) {
      p.removeChild(p.lastChild);
    }
    p.appendChild(ul);

    infobox.style.visibility = "visible";
  });

  google.maps.event.addListener(marker, 'mouseout', function (event) {
    for (var id in airport_markers) {
      airport_markers[id].setIcon(icon_filled_05);
    }

    for (var i=0; i < flights.length; i++) {
      flights[i].polygon.setOptions({
              strokeOpacity : 1.0
          });
    }

    var infobox = document.getElementById("infobox");
    infobox.style.visibility = "hidden";
  });
}

function initMap() {
  icon_filled = {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: '#990033',
    strokeOpacity: 0.0,
    strokeWeight: 0,
    fillColor: '#990033',
    fillOpacity: 1.0,
    scale: 3 //pixels
  };

  icon_filled_05 = {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: '#990033',
    strokeOpacity: 0.0,
    strokeWeight: 0,
    fillColor: '#990033',
    fillOpacity: 0.5,
    scale: 3 //pixels
  };

  icon_filled_01 = {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: '#990033',
    strokeOpacity: 0.0,
    strokeWeight: 0,
    fillColor: '#990033',
    fillOpacity: 0.1,
    scale: 3 //pixels
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.000, lng: 0.000},
    zoom: 4,
    streetViewControl: false
  });

  var bounds = new google.maps.LatLngBounds();
  for (var id in airports) {
    bounds.extend(airports[id].coords);
    newairport(airports[id].coords, id);
  }
  map.fitBounds(bounds);
  // map.setZoom(map.getZoom()-1);

  retro = [
            {
              elementType: 'geometry',
              stylers: [{color: '#ebe3cd'}]
            },
            {
              elementType: 'labels.text.fill',
              stylers: [{visibility: "off"}] // stylers: [{color: '#523735'}]
            },
            {
              elementType: 'labels.text.stroke',
              stylers: [{visibility: "off"}] // stylers: [{color: '#f5f1e6'}]
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.stroke',
              stylers: [{color: '#c9b2a6'}]
            },
            {
              featureType: 'administrative.land_parcel',
              elementType: 'geometry.stroke',
              stylers: [{color: '#dcd2be'}]
            },
            {
              featureType: 'administrative.land_parcel',
              elementType: 'labels.text.fill',
              stylers: [{visibility: "off"}] // stylers: [{color: '#ae9e90'}]
            },
            {
              featureType: 'landscape.natural',
              elementType: 'geometry',
              stylers: [{color: '#dfd2ae'}]
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [{color: '#dfd2ae'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{visibility: "off"}] // stylers: [{color: '#93817c'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry.fill',
              stylers: [{color: '#a5b076'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{visibility: "off"}] // stylers: [{color: '#447530'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#f5f1e6'}]
            },
            {
              featureType: 'road.arterial',
              elementType: 'geometry',
              stylers: [{color: '#fdfcf8'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#f8c967'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#e9bc62'}]
            },
            {
              featureType: 'road.highway.controlled_access',
              elementType: 'geometry',
              stylers: [{color: '#e98d58'}]
            },
            {
              featureType: 'road.highway.controlled_access',
              elementType: 'geometry.stroke',
              stylers: [{color: '#db8555'}]
            },
            {
              featureType: 'road.local',
              elementType: 'labels.text.fill',
              stylers: [{color: '#806b63'}]
            },
            {
              featureType: 'transit.line',
              elementType: 'geometry',
              stylers: [{color: '#dfd2ae'}]
            },
            {
              featureType: 'transit.line',
              elementType: 'labels.text.fill',
              stylers: [{color: '#8f7d77'}]
            },
            {
              featureType: 'transit.line',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#ebe3cd'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'geometry',
              stylers: [{color: '#dfd2ae'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{color: '#b9d3c2'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#92998d'}]
            }
          ];
  map.setOptions({styles: retro});

  var paths = [
                ["den", "sea"],
                ["den", "ord"],
                ["den", "okc"],
                ["den", "iah"],
                ["den", "fll"],
                ["den", "mco"],
                ["den", "mia"],
                ["den", "lax"],
                ["iah", "pbi"],
                ["fll", "uio"],
                ["iah", "gua"],
                ["okc", "dfw"],
                ["okc", "phx"],
                ["phx", "sea"],
                ["ord", "hpn"],
                ["den", "kef"],
                ["kef", "lgw"],
                ["ord", "yyz"],
                ["yyz", "cph"],
                ["cph", "fra"],
                ["fra", "vce"],
                ["cph", "bru"],
                ["bru", "ord"],
                ["lgw", "ist"],
                ["ist", "tlv"]
              ];
  for (var i=0; i < paths.length; i++) {
    newflight(paths[i]);
  }
}
