;(function() {

  let progressiveImages = [].map.call(document.querySelectorAll('.image-thumbnail'), (i) => i);

  let lazyLoadingBuffer = 300;

  let originImgLoaded = function(oimg) {
    oimg.parentNode.className += ' done ';
  };

  let insertOriginImg = function(thumbImg) {
    let originImg = new Image();
    originImg.className = 'image-progressive';
    originImg.onload = () => {
      originImgLoaded(originImg);
    };
    originImg.src = thumbImg.getAttribute('data-src');
    thumbImg.parentNode.appendChild(originImg);
  };

  let detectImgInViewport = function() {
    // if no image waiting for calculating position, return
    if (!progressiveImages.length) { return; }

    let winH = window.innerHeight;
    let _indexWaitingforRemove = [];

    progressiveImages.forEach(function(pimg, i) {
      let _rect = pimg.getBoundingClientRect();

      if ((_rect.top > (0 - lazyLoadingBuffer) && _rect.top < (winH + lazyLoadingBuffer)) ||
          (_rect.bottom > (0 - lazyLoadingBuffer) && _rect.bottom < (winH + lazyLoadingBuffer))) {
        let _index = progressiveImages.indexOf(pimg);
        _indexWaitingforRemove.push(_index);
        insertOriginImg(pimg);
      }
    });

    // remove images from calculating position
    if (_indexWaitingforRemove.length) {
      progressiveImages.splice(_indexWaitingforRemove[0], _indexWaitingforRemove.length);
    }
  };

  window.addEventListener('scroll', function() {
    detectImgInViewport();
  });

  let init = (function() {
    detectImgInViewport();
  })();

})();
