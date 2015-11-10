;(() => {

  let progressiveImages = [].map.call(document.querySelectorAll('.image-thumbnail'), (i) => i);

  let imagesPos = progressiveImages.map((pimg) => {
    let _rect = pimg.getBoundingClientRect();
    return {
      imgEl: pimg,
      top: _rect.top + window.pageYOffset,
      bottom: _rect.bottom + window.pageYOffset
    };
  });

  let lazyLoadingBuffer = 30;

  // ref: https://gist.github.com/Rplus/16117dc7b7567ba27162
  // ref: https://github.com/Leaflet/Leaflet/blob/v1.0.0-beta.2/src/dom/DomUtil.js#L189
  let prefixedTransitionEnd = (() => {
    let bs = document.body.style;
    let prefixedProp;
    let prefix;

    'webkit,,Moz,O,ms'.split(',').forEach((_p, i) => {
      if (prefixedProp) { return; }

      let prop = 'transition';
      if (_p.length) {
        prop = prop.charAt(0).toUpperCase() + prop.substr(1);
      }

      if ((prop = _p + prop) in bs) {
        prefix = _p;
        prefixedProp = prop;
      }
    });

    return prefixedProp + ( prefix.length ? 'End' : 'end');
  })();

  let originImgTransitionEnd = (oimg) => {
    let _parent = oimg.parentNode;
    _parent.removeChild(_parent.querySelector('.image-thumbnail'));
  };

  let originImgLoaded = (oimg) => {
    oimg.parentNode.className += ' done ';
    oimg.addEventListener(prefixedTransitionEnd, () => {
      originImgTransitionEnd(oimg);
    });
  };

  let insertOriginImg = (thumbImg) => {
    let originImg = new Image();
    originImg.className = 'image-progressive';
    originImg.onload = () => {
      originImgLoaded(originImg);
    };
    originImg.src = thumbImg.getAttribute('data-src');
    thumbImg.parentNode.appendChild(originImg);
  };

  let detectImgInViewport = () => {
    // if no image waiting for calculating position, return
    if (!imagesPos.length) { return; }

    // let winH = window.innerHeight;
    let _viewportTop = window.pageYOffset;
    let _viewportBottom = _viewportTop + window.innerHeight;

    let _indexWaitingforRemove = [];

    imagesPos.forEach((imgCachedData, i) => {
      if (
        (imgCachedData.bottom < _viewportBottom && imgCachedData.bottom > _viewportTop) ||
        (imgCachedData.top > _viewportTop && imgCachedData.top < _viewportBottom)
      ) {
        insertOriginImg(imgCachedData.imgEl);
        _indexWaitingforRemove.push(i);
      }
    });

    // remove images from calculating position
    if (_indexWaitingforRemove.length) {
      for (var i = _indexWaitingforRemove.length - 1; i >= 0; i--) {
        imagesPos.splice(_indexWaitingforRemove[i], 1);
      }
    }
  };

  window.addEventListener('scroll', () => {
    detectImgInViewport();
  });

  let init = (() => {
    detectImgInViewport();
  })();

})();
