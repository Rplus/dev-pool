/* global window, document, console, jQuery */

jQuery(function($) {
  'use strict';

  var SwitchCheckbox = function(wrapperEle, inputSelector) {

    var SC = {
      input: (function() {
        var _inputs = wrapperEle.querySelectorAll('.item-input');

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

      // not found || outside
      if (-1 === SC.ind.new) { return; }

      // init state
      if (state && 'start' === state) {
        SC.ind.start = SC.ind.new;
        SC.ind.current = SC.ind.new;
      }

      // move to other item
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
      var _min = Math.min(_start, _cureent);
      var _max = Math.max(_start, _cureent);
      var i = 0;

      console.log('min: '+ _min + ', max: ' + _max);

      // it will update all input(s)'s checkbox state,
      // when items' count be larger, the performance maybe poorer
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

    $(wrapperEle).on(touchFactor.evt.start, function(e) {
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

  };

  SwitchCheckbox(document.querySelector('.items'), '.item-input');

});
