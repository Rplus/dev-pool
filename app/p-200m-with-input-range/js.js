/* global document */
var myLatLng = {};

var getGeoFallback = () => {
  var _lat = window.prompt('Can\'t find geo-location automatically, please fill with latitude(lat)', '25.0327429');
  var _lng = window.prompt('Can\'t find geo-location automatically, please fill with longitude(lng)', '121.5668311');

  myLatLng.lat = parseFloat(_lat) || 25.0327429;
  myLatLng.lng = parseFloat(_lng) || 121.5668311;

  init();
};

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition((geo) => {
    myLatLng.lat = geo.coords.latitude;
    myLatLng.lng = geo.coords.longitude;

    init();
  }, getGeoFallback);
} else {
  getGeoFallback();
}

var init = () => {
  var mapBox = document.querySelector('.map');
  mapBox.style.backgroundImage = `url(https://maps.googleapis.com/maps/api/staticmap?center=${myLatLng.lat},${myLatLng.lng}&zoom=17&size=600x600&markers=${myLatLng.lat},${myLatLng.lng})`;

  var axisAX = document.querySelector('.axis-ax');
  var axisAY = document.querySelector('.axis-ay');

  var axisBX = document.querySelector('.axis-bx');
  var axisBY = document.querySelector('.axis-by');

  var pointA = document.querySelector('.point--a');
  var pointB = document.querySelector('.point--b');

  axisAX.addEventListener('input', (e) => {
    pointA.style.left = `${e.target.value}%`;
  });

  axisAY.addEventListener('input', (e) => {
    pointA.style.top = `${e.target.value}%`;
  });

  axisBX.addEventListener('input', (e) => {
    pointB.style.left = `${e.target.value}%`;
  });

  axisBY.addEventListener('input', (e) => {
    pointB.style.top = `${e.target.value}%`;
  });
};
