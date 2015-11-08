;(function() {

  let progressiveImages = document.querySelectorAll('.image-thumbnail');

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

  [].forEach.call(progressiveImages, function(pimg) {
    insertOriginImg(pimg);
  });

})();
