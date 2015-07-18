/* global window, document, console, jQuery */

jQuery(function($) {
  'use strict';

  var SwitchCheckbox = function(wrapperEle, inputSelector) {
  //
  var ul = wrapperEle;
  var SC = {
    input: (function() {
      var _inputs = ul.querySelectorAll('.item-input');

      return {
        eles: [].slice.call(_inputs),
        len: _inputs.length,
        state: []
      };
    })(),
    ind: {
      start: null,
      current: null,
      new: null
    },
    pos: {
      x: 0,
      y:0
    },
    state: {
      start: [],
      current: []
    }
  };

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

  var updatePos = function(e, state) {
    if (!touchFactor.start) { return; }

    var _pos = touchFactor.isSupportTouch ? e.originalEvent.touches[0] : e;

    SC.pos = {
      x: _pos.clientX,
      y: _pos.clientY
    };

    calcIndex(state);
  };

  var calcIndex = function(state) {
    if (!touchFactor.start) { return; }

    SC.ind.new = $(document.elementFromPoint(SC.pos.x, SC.pos.y)).closest('.item').index();

    if (-1 === SC.ind.new) { return; }

    if (state && 'start' === state) {
      SC.ind.start = SC.ind.new;
      SC.ind.current = SC.ind.new;
    }

    if (SC.ind.new !== SC.ind.current) {
      // update SC.ind.current
      SC.ind.current = SC.ind.new;

      updateCheckedState();
    }
  };

  var updateCheckedState = function() {
    if (!touchFactor.start) { return; }
    var _start = SC.ind.start;
    var _cureent = SC.ind.current;
    var i = 0;
    var _min = Math.min(_start, _cureent);
    var _max = Math.max(_start, _cureent);
    console.log('min: '+ _min + ', max: ' + _max);

    for (; i < SC.input.len; i++) {
      if (i >= _min && i <= _max) {
        SC.input.eles[i].checked = !SC.state.start[i];
      } else {
        SC.input.eles[i].checked = SC.state.start[i];
      }
    }

  };

  var cachedStatus = function() {
    var i = 0;
    for (; i < SC.input.len; i++) {
      SC.state.start[i] = SC.input.eles[i].checked;
    }
  };

  $(ul).on(touchFactor.evt.start, function(e) {
    touchFactor.start = true;
    cachedStatus();

    updatePos(e, 'start');
  })
  .on(touchFactor.evt.move, function(e) {
    // disable select text in desktop &
    // disable scroll in mobile
    e.preventDefault();
    e.stopPropagation();

    updatePos(e);
  })
  .on(touchFactor.evt.end, function() {
    touchFactor.start = false;
  });

  //
  };

  SwitchCheckbox(document.querySelector('.items'), '.item-input');

});
