/* global document, console, window */

(function () {
  'use strict';

  var inputs = document.getElementsByTagName('input');
  var varInput = document.querySelectorAll('[data-str]');
  var style = document.getElementById('inline');
  var permalink = document.getElementById('permalink');
  var data = {
    color: {
      hex: '#9900ff',
      alpha: 0.6
    },
    radius: {
      h: 0,
      v: 0,
      linked: true,
      unit: '%'
    }
  };

  var updateData = function(inputArray, _id) {
    inputArray = inputArray ? inputArray : varInput;

    [].forEach.call(inputArray, function(_input) {
      var _type = _input.type;

      if ('radio' === _type && !_input.checked) {return; }

      var pos = _input.getAttribute('data-str').split('.');
      var val = ('checkbox' === _type) ? _input.checked : _input.value;

      data[pos[0]][pos[1]] = val;
    });

    // if radius liined
    if (/radius/.test(_id) && data.radius.linked) {
      var linkedTargetId = ('radius-h' === _id) ? 'radius-v' : 'radius-h';
      var linkedTarget = document.getElementById(linkedTargetId);
      var changingItem = document.getElementById(_id);

      linkedTarget.value = changingItem.value;

      // update just another linked input value
      updateData([linkedTarget]);
    }

    updateState();
  };

  var updateState = function() {
    var dataExport = JSON.stringify(data);
    // // that cause too many history, so I remove it...
    // history.pushState(null, null, location.href);
    location.hash = 'go=' + dataExport;
    permalink.href = location.origin + location.pathname + '#go=' + dataExport;
  };

  var hex2Dec = function(hex) {
    return Number('0x' + hex.toString());
  };

  var rgba = function(hexColor, alpha) {
    hexColor = hexColor.trim().substr(1);
    alpha = (alpha !== undefined ? alpha : 1);

    var step = (hexColor.length / 3);
    var pattern = new RegExp('.{' + step + '}', 'g');
    var colorString = hexColor.match(pattern);
    var r, g, b;

    r = hex2Dec(colorString[0]);
    g = hex2Dec(colorString[1]);
    b = hex2Dec(colorString[2]);

    return 'rgba(' + [r,g,b,alpha].join(',') + ')';
  };

  var render = function() {
    style.textContent = '.hexagon, .hexagon::before, .hexagon::after {\n  color: ' + rgba(data.color.hex, data.color.alpha) + ';\n  border-radius: ' + [data.radius.h, data.radius.unit, ' / ', data.radius.v, data.radius.unit].join('') + ';\n}';

    style.className = '';

    setTimeout(function() {
      style.className = 'update';
    }, 30);
  };

  var bindChange = function() {
    [].forEach.call(varInput, function(_input) {
      _input.addEventListener('change', function() {
        renderWithUpdate(this.id);
      });
      _input.addEventListener('input', function() {
        renderWithUpdate(this.id);
      });
    });

    // bind reset
    document.getElementById('reset').addEventListener('click', function(e) {
      setTimeout(renderWithUpdate, 50);
    });
  };

  var renderWithUpdate = function(_id) {
    console.log(this, 333);
    updateData(false, _id);
    render();
  };

  var init = (function() {
    var dataImport = location.hash.split('#go=');
    if (dataImport.length > 1) {
      data = JSON.parse(dataImport[1]);
    } else {
      updateData();
    }
    render();
    bindChange();
  })();

})();
