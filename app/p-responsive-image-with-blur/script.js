;(function() {

  let progressiveImages = [].map.call(document.querySelectorAll('.image-thumbnail'), (i) => i);

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

      if ((_rect.top > 0 && _rect.top < winH) || (_rect.bottom > 0 && _rect.bottom < winH)) {
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
