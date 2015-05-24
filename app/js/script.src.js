/* global document, console, window */

( () => {

'use strict';
var reorderArrByQ4 = (_arrLen) => {
    // generate series integer array
    // via: http://stackoverflow.com/a/20066663
    var _integerArr = Array.apply(null, {length: _arrLen}).map(Number.call, Number);

    var q1 = (_arrLen - 1) / 4;
    var q3 = (_arrLen - 1) * 3 / 4;

    var nearerDistance = (_n) => {
        return Math.min(Math.abs(_n - q1), Math.abs(_n - q3));
    };

    _integerArr.sort( (a,b) => {
      return nearerDistance(a) - nearerDistance(b);
    });

    console.log(_integerArr);
    return _integerArr;
};

var logoAnimation = (_timeout = 500, largerClass = 'larger', visibleClass = 'visible') => {

    var _name = document.getElementById('name');
    var _chars = document.querySelectorAll('.char:not(.visible)');
    var _charsLen = _chars.length;
    var reorderCharsArr = reorderArrByQ4(_charsLen);

    var delayAnimatedChars = (_index, _order) => {
        window.setTimeout( () => {
            _chars[_order].classList.add(visibleClass);
        }, _timeout + 100 * ( Math.ceil(_index / 2) * 3 - (_index % 2) ));
    };

    for (var i = 0, len = _charsLen - 1; len >= i; i++) {
        delayAnimatedChars(i, reorderCharsArr[i]);
    }

    _name.classList.remove(largerClass);
};

// via: http://youmightnotneedjquery.com/
var ready = fn => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

ready( () => {
    window.setTimeout(logoAnimation, 500);
});

})();
