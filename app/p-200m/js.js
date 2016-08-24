var myLatLng = {};

var lazyMapScript = () => {
  let s = document.createElement('script');
  s.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap';
  document.getElementsByTagName('head')[0].appendChild(s);
};

var getGeoFallback = () => {
  var _lat = window.prompt('Can\'t find geo-location automatically, please fill with latitude(lat)', '25.0327429');
  var _lng = window.prompt('Can\'t find geo-location automatically, please fill with longitude(lng)', '121.5668311');

  myLatLng.lat = parseFloat(_lat) || 25.0327429;
  myLatLng.lng = parseFloat(_lng) || 121.5668311;

  lazyMapScript();
};

/* global google */
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition((geo) => {
    myLatLng.lat = geo.coords.latitude;
    myLatLng.lng = geo.coords.longitude;

    lazyMapScript();
  }, getGeoFallback);
} else {
  getGeoFallback();
}

var map;
window.initMap = () => {
  var latLngA = {
    lat: myLatLng.lat,
    lng: myLatLng.lng - 0.001
  };

  var latLngB = {
    lat: myLatLng.lat,
    lng: myLatLng.lng + 0.001
  };

  var getCircleStyle = (pos) => {
    return {
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: '#000000',
      fillOpacity: 0.1,
      map: map,
      center: pos,
      radius: 200
    };
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    scaleControl: true,
    zoom: 17
  });

  // zero-point
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    draggable: false
  });

  console.log(marker);

  var markerA = new google.maps.Marker({
    position: latLngA,
    map: map,
    label: 'A',
    draggable: true
  });

  var markerB = new google.maps.Marker({
    position: latLngB,
    map: map,
    label: 'B',
    draggable: true
  });

  var circleA = new google.maps.Circle(getCircleStyle(latLngA));
  var circleB = new google.maps.Circle(getCircleStyle(latLngB));

  markerA.addListener('dragend', (e) => {
    circleA.setMap(null);
    circleA = new google.maps.Circle(getCircleStyle({lat: e.latLng.lat(), lng: e.latLng.lng()}));
  });

  markerB.addListener('dragend', (e) => {
    circleB.setMap(null);
    circleB = new google.maps.Circle(getCircleStyle({lat: e.latLng.lat(), lng: e.latLng.lng()}));
  });
};
