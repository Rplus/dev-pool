/* global window, document, console, jQuery */

jQuery(function($) {
  'use strict';

  var DEBUG = false;

  var doc = document;
  var log = function() {
    if (DEBUG) {
      console.log(arguments);
    }
  };

  var $ul = $('.items');

  var input = (function() {
    var eles = $ul.find('.item-input');

    return {
      eles: eles,
      len: eles.length,
      status: []
    };
  })();

  var touchFactor = {
    start: false,
    move: false,
    calcLock: false,
    isSupportTouch: ('ontouchstart' in window)
  };

  touchFactor.evt = (function() {
    var mobileEvent = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend'
    };

    var desktopEvent = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    };

    return touchFactor.isSupportTouch ? mobileEvent : desktopEvent;
  })();

  var renewStatus = function(e) {
    if (!touchFactor.start || touchFactor.calcLock) { return; }

    // lock renew
    touchFactor.calcLock = true;

    var _pos, _target, _input, $item, _index;

    _pos = touchFactor.isSupportTouch ? e.originalEvent.touches[0] : e;
    _target = doc.elementFromPoint(_pos.clientX, _pos.clientY);
    $item = $(_target).closest('.item');

    if (!$item.length) {
      touchFactor.calcLock = false;
      return;
    }

    _index = $item.index();
    _input = $item.children('.item-input')[0];

    log(_index, _target.tagName, _input.checked);

    touchFactor.calcLock = false;

    log(_input.checked, input.status[_index]);

    // change checked if diff status
    if (input.status[_index] === _input.checked) {
      _input.checked = !input.status[_index];
    }

    requestAnimationFrame(function() {
      renewStatus(e);
    });
  };

  var cachedStatus = function() {
    var i = 0;
    for (; i < input.len; i++) {
      input.status[i] = input.eles[i].checked;
    }
    log(input.status);
  };

  $ul.on(touchFactor.evt.start, function() {
    touchFactor.start = true;
    cachedStatus();
  })
  .on(touchFactor.evt.move, function(e) {
    // disable select text in desktop &
    // disable scroll in mobile
    e.preventDefault();
    e.stopPropagation();
    renewStatus(e);
  })
  .on(touchFactor.evt.end, function() {
    touchFactor.start = false;
  });

});
