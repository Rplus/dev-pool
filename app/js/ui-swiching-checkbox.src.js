/* global window, document, console, jQuery */

jQuery(function($) {
  'use strict';

  var doc = document;

  var ul = doc.querySelector('.items');

  var input = (function() {
    var eles = [].slice.call(ul.querySelectorAll('.item-input'));

    return {
      eles: eles,
      len: eles.length,
      status: []
    };
  })();

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

  var renewStatus = function(e) {
    if (!touchFactor.start || touchFactor.calcLock) { return; }

    // lock renew
    touchFactor.calcLock = true;

    var _pos, _target, _input, $item, _index;

    _pos = touchFactor.isSupportTouch ? e.originalEvent.touches[0] : e;
    _target = doc.elementFromPoint(_pos.clientX, _pos.clientY);
    $item = $(_target).closest('.item');

    _index = $item.index();
    // _index = input.eles.indexOf($item[0]);

    if (!$item.length || _index === touchFactor.currentIndex) {
      touchFactor.calcLock = false;
      return;
    }

    touchFactor.currentIndex = _index;

    _input = $item[0].querySelector('.item-input');

    // console.log(_index, _target.tagName, _input.checked);

    touchFactor.calcLock = false;

    // console.log(_input.checked, input.status[_index]);

    // change checked if diff status
    if (input.status[_index] === _input.checked) {
      _input.checked = !input.status[_index];
      input.status[_index] = !input.status[_index];
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
    console.log(input.status);
  };

  $(ul).on(touchFactor.evt.start, function() {
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
