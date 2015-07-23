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

  $(eles.article)
    .on(touchFactor.evt.start, function(evt) {
      var _pos = touchFactor.isSupportTouch ? evt.originalEvent.touches[0] : evt;
      console.log('start');
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

        if (deltaY < -1 * articleOuterHeight / 2) {
          console.log('up');
          if (this.previousElementSibling) {
            this.previousElementSibling.querySelector('.article--wrap').style.transform = 'translateY(' + articleOuterHeight + 'px)';
          }
        } else if (deltaY > articleOuterHeight / 2) {
          console.log('down');
          if (this.nextElementSibling) {
            this.nextElementSibling.querySelector('.article--wrap').style.transform = 'translateY(-' + articleOuterHeight + 'px)';
          }
        } else {
          if (this.nextElementSibling) {
            this.nextElementSibling.querySelector('.article--wrap').style.transform = 'none';
          }

          if (this.previousElementSibling) {
            this.previousElementSibling.querySelector('.article--wrap').style.transform = 'none';
          }
        }

      });
    })
    .on(touchFactor.evt.end, function() {
      $(this).off('.drag');
      $(eles.articleWrap).css('transform', 'none');
      console.log('end');
    });
});
