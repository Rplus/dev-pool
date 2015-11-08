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

  let originImgLoaded = (oimg) => {
    oimg.parentNode.className += ' done ';
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
