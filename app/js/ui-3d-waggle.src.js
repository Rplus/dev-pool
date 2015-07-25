/* global window, document, console, jQuery */

jQuery(function($) {
  'use strict';

  var eles = {};
  eles.mobile = document.querySelector('.mobile');
  eles.articles = eles.mobile.querySelector('.articles');
  eles.article = eles.articles.querySelectorAll('.article');
  eles.articleWrap = eles.articles.querySelectorAll('.article-card');
  eles.articleCard = eles.articles.querySelectorAll('.card');
  eles.articleCloned = eles.articles.querySelector('.cloned');

  if (eles.article.length < 2) {
    return;
  }

  var article = {
    height: eles.article[0].getBoundingClientRect().height,
    outerHeight: eles.article[1].getBoundingClientRect().top - eles.article[0].getBoundingClientRect().top,
    arr: [].slice.call(eles.article, 0)
  };

  article.margin = article.outerHeight - article.height;

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

  var dragIt = {
    threshold: article.height / 2 + article.margin,
    start: false,
    startPoint: {},
    target: {
      id: null,
      top: 0,
      left: 0
    }
  };

  var articlePos = {
    top: [],
    center: [],
    bottom: []
  };

  for (var i = 0; i < eles.article.length; i++) {
    var _rect = eles.article[i].getBoundingClientRect();
    articlePos.top.push(_rect.top);
    articlePos.center.push(_rect.top + article.height / 2);
    articlePos.bottom.push(_rect.bottom);
  }

  console.log(articlePos);

  var dragStart = function(_target) {
    eles.mobile.classList.add('is-dragging');

    // calc point
    dragIt.target.id = article.arr.indexOf(_target);
    dragIt.target.top = _target.offsetTop;
    dragIt.target.left = _target.offsetLeft;
  };

  var dragEnd = function() {
    eles.mobile.classList.remove('is-dragging');

    var draggingTarget = eles.articles.querySelector('.dragging-target');

    if (draggingTarget) {
      draggingTarget.classList.remove('dragging-target');
    }
  };

  var cloneCard = function(_target) {

    if (!eles.articleCloned) {

      eles.articleCloned = _target.cloneNode(true);
      eles.articleCloned.classList.add('cloned');
      eles.articleCloned.style.width = _target.getBoundingClientRect().width + 'px';
      eles.articles.appendChild(eles.articleCloned);

    } else {

      eles.articleCloned.innerHTML = _target.innerHTML;

    }

    _target.classList.add('dragging-target');

    eles.articleCloned.style.top = dragIt.target.top + 'px';
    eles.articleCloned.style.left = dragIt.target.left + 'px';
  };

  var switchCard = function(dir, step) {
    var id1 = dragIt.target.id;
    var id2 = id1 + dir * step;

    var a1 = article.arr[id1];
    var a2 = article.arr[id2];

    if (dir > 0) {
      // if id2 is last one, next will be the `cloned` one.
      a2 = a2.nextElementSibling;
    }

    eles.articles.insertBefore(a1, a2);

    resetArticleOrder();
  };

  var shiftCard = function(dir) {
    var id1 = dragIt.target.id;
    var id2 = id1 + dir;
  };

  var resetArticleOrder = function() {
    // reset
    eles.article = eles.articles.querySelectorAll('.article');
    article.arr = [].slice.call(eles.article, 0);

    for (var i = article.arr.length - 1; i >= 0; i--) {
      article.arr[i].classList.remove('shift-up');
      article.arr[i].classList.remove('shift-down');
    }
  };

  $(eles.articles)
    .on(touchFactor.evt.start, '.article', function(e) {
      console.log('start');
      dragStart(this);
      cloneCard(this);

      dragIt.start = true;

      dragIt.startPoint = {
        x: e.clientX,
        y: e.clientY
      };

      // $(this).one('animationend', resetArticleOrder);
    })
    .on(touchFactor.evt.move, function(e) {
      if (!dragIt.start) { return; }
      dragIt.moving = true;

      var deltaY = e.clientY - dragIt.startPoint.y;

      // console.log(deltaY, dragIt.startPoint.y);

      if (Math.abs(deltaY) > dragIt.threshold) {
        console.log('shiftCard');
        // shiftCard(deltaY > 0 ? 1 : -1);
      }

      eles.articleCloned.style.transform = 'translateY(' + deltaY + 'px)';

    })
    .on(touchFactor.evt.end, function(e) {
      if (dragIt.moving) {
        eles.articleCloned.style.transform = null;
        resetArticleOrder();

        var deltaY = e.clientY - dragIt.startPoint.y;
        var dir = (deltaY > 0) ? 1 : -1;
        var step = ~~((dir * deltaY - article.height / 2) / article.outerHeight) + 1;

        if (Math.abs(deltaY) > dragIt.threshold) {
          switchCard(dir, step);
        }

        dragIt.moving = false;
      }

      dragEnd();
      dragIt.start = false;
      console.log('end');
    });


});
