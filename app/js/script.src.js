
var _name = document.getElementById('name');
var _chars = document.querySelectorAll('.char:not(.visible)');
var largerClass = 'larger';
var visibleClass = 'visible';
var initTimeout = 500; // 500ms

var logoAnimation = function () {
    'use strict';

    var _charsLen = _chars.length;

    var reorderChars = (function () {
        var _midIndex = _charsLen / 2;
        var _arrBefore = [];
        var _arrAfter = [];

        for (var i = _charsLen - 1; i >= 0; i--) {
            if (i >= _midIndex) {
                _arrAfter.unshift(i);
            } else {
                _arrBefore.unshift(i);
            }
        }

        var orderByMid = function (_arr) {
            var _len = _arr.length;
            var _midIndexOfArr = (_arr[0] + _arr[_len - 1]) / 2;
            return _arr.sort(function (a, b) {
                return Math.abs(a - _midIndexOfArr) - Math.abs(b - _midIndexOfArr);
            });
        };

        var _arrBeforeOrdered = orderByMid(_arrBefore);
        var _arrAfterOrdered = orderByMid(_arrAfter);
        // console.log(_arrAfter, _arrBefore, _arrBeforeOrdered, _arrAfterOrdered);

        var _finArr = [];
        (function () {
        for (var i = 0, len = _charsLen - 1; len >= i; i++) {
            var _arr = (i % 2) ? _arrAfterOrdered : _arrBeforeOrdered;
            _finArr.push(_arr[Math.floor(i / 2)]);
        }
        }());

        return _finArr;
    }());

    for (var i = 0, len = _charsLen - 1; len >= i; i++) {
        (function (_index, _order) {
            setTimeout(function () {
                _chars[_index].classList.add(visibleClass);
            }, initTimeout + 100 * (_order + _order % 2));
        })(i, reorderChars[i]);
    }

    _name.classList.remove(largerClass);
};

setTimeout(logoAnimation, 500);
