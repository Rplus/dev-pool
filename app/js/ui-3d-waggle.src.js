/* global window, document, console, jQuery */

jQuery(function($) {
  'use strict';

  var eles = {};
  eles.body = document.querySelector('.body');
  eles.mobile = document.querySelector('.mobile');
  eles.articles = eles.mobile.querySelector('.articles');
  eles.article = eles.articles.querySelectorAll('.article');
  eles.articleWrap = eles.articles.querySelectorAll('.article-card');
  eles.articleCard = eles.articles.querySelectorAll('.card');
  eles.articleCloned = eles.articles.querySelector('.cloned');

  eles.$articles = $(eles.articles);

  if (eles.article.length < 2) {
    return;
  }

  var article = {
    len: eles.article.length,
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

  for (var i = 0; i < article.len; i++) {
    var _rect = eles.article[i].getBoundingClientRect();
    articlePos.top.push(_rect.top);
    articlePos.center.push(_rect.top + article.height / 2);
    articlePos.bottom.push(_rect.bottom);
  }

  console.log(articlePos);

  var dragStart = function(_target) {
    dragIt.start = true;

    eles.mobile.classList.add('is-dragging');

    // calc point
    dragIt.target.id = article.arr.indexOf(_target);
    dragIt.target.top = _target.offsetTop;
    dragIt.target.left = _target.offsetLeft;

    if (touchFactor.isSupportTouch) {
      eles.body.classList.add('disable-scroll');
    }

  };

  var dragMove = function() {
    dragIt.moving = true;
  };

  var dragEnd = function() {
    dragIt.start = false;

    eles.$articles.off(touchFactor.evt.move);

    resetShift();

    eles.mobile.classList.remove('is-dragging');

    var draggingTarget = eles.articles.querySelector('.dragging-target');

    if (draggingTarget) {
      draggingTarget.classList.remove('dragging-target');
    }

    if (touchFactor.isSupportTouch) {
      eles.body.classList.remove('disable-scroll');
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

  var swapCard = function(opt) {
    if (!opt.threshold) { return; }

    var id1 = dragIt.target.id;
    var id2 = id1 + opt.dir * opt.step;

    var a1 = article.arr[id1];
    var a2 = article.arr[id2];

    if (opt.dir > 0) {
      // if id2 is last one, next will be the `cloned` one.
      a2 = a2.nextElementSibling;
    }

    eles.articles.insertBefore(a1, a2);

    resetArticleOrder();
  };

  var shift = {
    classUp: 'shift-up',
    classDown: 'shift-down',
    step: null,
    max: 0,
    min: 0
  };

  // ref: http://stackoverflow.com/a/7180095
  Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };

  var resetShift = function() {
    shift.max = 0;
    shift.min = 0;

    for (var i = article.len - 1; i >= 0; i--) {
      eles.article[i].classList.remove(shift.classUp);
      eles.article[i].classList.remove(shift.classDown);
    }

  };

  var shiftCard = function(opt) {
    // if (!opt.threshold) { return; }

    var _step = opt.dir * opt.step;

    // avoid repeat trigger
    if (_step === shift.step) { return; }

    shift.step = _step;

    if (_step > shift.max) { shift.max = _step; }
    if (_step < shift.min) { shift.min = _step; }

    var className = (opt.dir > 0) ? shift.classUp : shift.classDown;

    var id1 = dragIt.target.id;
    var id2 = id1 + _step;
    if (id2 < 0) { id2 = 0; }

    var idSmall = Math.min(id1, id2);
    var idLarge = Math.max(id1, id2);

    var idMin = id1 + shift.min;
    var idMax = id1 + shift.max;

    for (var i = idMax; i >= idMin; i--) {
      if (i < 0) { return; }
      if (i >= idSmall && i <= idLarge) {
        eles.article[i].classList.add(className);
      } else {
        eles.article[i].classList.remove(className);
      }
    }
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

  var calcStep = function(deltaY) {
    var dir = (deltaY > 0) ? 1 : -1;
    var step = Math.ceil((dir * deltaY - article.height / 2) / article.outerHeight);

    return {
      dir: dir,
      step: step,
      threshold: Math.abs(deltaY) > dragIt.threshold
    };
  };

  var distanceToDegree = function(dis) {
    return 2 * Math.atan(dis * 0.5 / 300) * 180 / Math.PI;
  };

  var lastPos;

  eles.$articles
    .on(touchFactor.evt.start, '.article', function(e) {
      console.log('start');
      dragStart(this);
      cloneCard(this);

      var _pos = touchFactor.isSupportTouch ? e.originalEvent.touches[0] : e;

      dragIt.startPoint = {
        x: _pos.clientX,
        y: _pos.clientY
      };

      var prevPosY = 0;

      // move
      eles.$articles
        .on(touchFactor.evt.move, function(e) {
          if (!dragIt.start) { return; }

          var _pos = touchFactor.isSupportTouch ? e.originalEvent.touches[0] : e;

          if (touchFactor.isSupportTouch) {
            lastPos = _pos;
          }

          dragMove();

          var deltaY = _pos.clientY - dragIt.startPoint.y;
          var deltaX = _pos.clientX - dragIt.startPoint.x;

          shiftCard(calcStep(deltaY));

          var newPosY = _pos.clientY;
          var rotateX = (newPosY > prevPosY) ? -60 : 40 ;

          eles.articleCloned.style.transform = 'translateY(' + deltaY + 'px) translateX(' + deltaX + 'px) rotateY(' + distanceToDegree(-deltaX) + 'deg) rotateX(' + rotateX + 'deg)';

          prevPosY = newPosY;
        });
    })
    .on(touchFactor.evt.end, function(e) {
      var _pos = touchFactor.isSupportTouch ? lastPos : e;

      if (dragIt.moving) {
        eles.articleCloned.style.transform = null;
        resetArticleOrder();

        var deltaY = _pos.clientY - dragIt.startPoint.y;

        swapCard(calcStep(deltaY));

        dragIt.moving = false;
      }

      dragEnd();

      console.log('end');
    });

});
