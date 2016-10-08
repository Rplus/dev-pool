/* global document */

class GeoMap {
  constructor () {
    this.ele = {
      mapBox: document.querySelector('.map'),

      refreshBtn: document.querySelector('.map-refresh'),
      axisAX: document.querySelector('.axis-ax'),
      axisAY: document.querySelector('.axis-ay'),

      axisBX: document.querySelector('.axis-bx'),
      axisBY: document.querySelector('.axis-by'),

      pointA: document.querySelector('.point--a'),
      pointB: document.querySelector('.point--b')
    };

    this.latLng = {};
    this.mapZoom = 17;
    this.mapSize = 600;
    this.key = 'AIzaSyCjDnDGv67nvhzBsLRYAwTbiF1HrZBQDUM';
  }

  getGeoFallback () {
    console.log(111111);

    let _lat = window.prompt('Can\'t find geo-location automatically, please fill with latitude(lat)', '25.0327429');
    let _lng = window.prompt('Can\'t find geo-location automatically, please fill with longitude(lng)', '121.5668311');

    this.latLng.lat = parseFloat(_lat) || 25.0327429;
    this.latLng.lng = parseFloat(_lng) || 121.5668311;

    return this.latLng;
  }

  getGeo () {
    let self = this;
    return new Promise(function (resolve, reject) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }, () => {
          resolve(self.getGeoFallback());
        });
      } else {
        resolve(this.getGeoFallback());
      }
    });
  }

  getGmapImgSrc (latLng = this.latLng, zoom = this.mapZoom, size = this.mapSize) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${latLng.lat},${latLng.lng}&zoom=${zoom}&size=${size}x${size}&markers=${latLng.lat},${latLng.lng}&key=${this.key}`;
  }

  setEleBgi (ele, bgiSrc) {
    ele.style.backgroundImage = `url('${bgiSrc}')`;
  }

  updateBgi () {
    this.getGeo()
      .then((latLng) => {
        this.setEleBgi(this.ele.mapBox, this.getGmapImgSrc(latLng));
      });
  }

  bindMoveEvent () {
    let eventMapping = [
      {
        axis: 'axisAX',
        target: 'pointA'
      },
      {
        axis: 'axisAY',
        target: 'pointA'
      },
      {
        axis: 'axisBX',
        target: 'pointB'
      },
      {
        axis: 'axisBY',
        target: 'pointB'
      }
    ];

    eventMapping.forEach((i) => {
      let dir = (i.axis.slice(-1) === 'Y' ? 'top' : 'left');

      this.ele[i.axis].addEventListener('input', (e) => {
        this.ele[i.target].style[dir] = `${e.target.value}%`;
      });
    });
  }

  bindUpdate () {
    this.ele.refreshBtn.addEventListener('click', (e) => {
      this.updateBgi();
    });
  }

  init () {
    this.updateBgi();
    this.bindMoveEvent();
    this.bindUpdate();
  }
}

new GeoMap().init();
