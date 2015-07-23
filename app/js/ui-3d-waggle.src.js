/* global window, document, console, jQuery */

jQuery(function($) {
  'use strict';

  var eles = {};
  eles.mobile = document.querySelector('.mobile');
  eles.articles = eles.mobile.querySelector('.articles');
  eles.article = eles.articles.querySelectorAll('.article');
  eles.articleWrap = eles.articles.querySelectorAll('.article--wrap');
  eles.articleCard = eles.articles.querySelectorAll('.article__card');

  var articleOuterHeight = eles.article[1].getBoundingClientRect().top - eles.article[0].getBoundingClientRect().top;

  var articleArr = Array.prototype.slice.call(eles.article, 0);

  var touchFactor = {
    start: false,
    move: false,
    currentIndex: null,
    calcLock: false,
    events: {
      mobile: {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
      },
      desktop: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
      }
    },
    isSupportTouch: ('ontouchstart' in window)
  };

  touchFactor.evt = (function() {
    return touchFactor.isSupportTouch ? touchFactor.events.mobile : touchFactor.events.desktop;
  })();

  var sortIndex = [];

  var articleTop = [];
  var articleBottom = [];
  var articleSort = [];

  for (var i = 0; i < eles.article.length; i++) {
    articleTop.push(eles.article[i].getBoundingClientRect().top);
    articleBottom.push(eles.article[i].getBoundingClientRect().bottom);
    articleSort.push([i, eles.article[i]]);
  };

  console.log(articleTop, articleBottom);

  var updatePos = function(opt) {
    var nowIndex;

    for (var i = articleTop.length - 1; i >= 0; i--) {
      if (i !== opt.start && articleTop[i] < opt.Y) {
        console.log(articleTop[i], i);

        break;
      }
    };

  };

  $(eles.article)
    .on(touchFactor.evt.start, function(evt) {
      var _pos = touchFactor.isSupportTouch ? evt.originalEvent.touches[0] : evt;
      console.log('start');

      var _index = articleArr.indexOf(this);

      var oPoint = {
        X: _pos.clientX,
        Y: _pos.clientY
      };

      var dragItem = this.querySelector('.article--wrap');
      var transformItem = this.querySelector('.article__card');

      $(this).on(touchFactor.evt.move + '.drag', function(e) {
        var _movPos = touchFactor.isSupportTouch ? e.originalEvent.touches[0] : e;
        var deltaX = _movPos.clientX - oPoint.X;
        var deltaY = _movPos.clientY - oPoint.Y;

        dragItem.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
        // transformItem.style.transform = 'rotate3d(' + [deltaX, deltaY, 0, 45].join() + 'deg)';

        updatePos({
          start: _index,
          X: _movPos.clientX,
          Y: _movPos.clientY,
          ele: this
        });

      });
    })
    .on(touchFactor.evt.end, function() {
      $(this).off('.drag');
      $(eles.articleWrap).css('transform', 'none');
      console.log('end');
    });
});
