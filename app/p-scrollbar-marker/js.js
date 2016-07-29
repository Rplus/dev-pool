/* global Mark */
(() => {
  var containerQS = '.article';
  var container = document.querySelector(containerQS);

  var form = document.querySelector('.form');
  var input = form.querySelector('input[type="text"]');

  var markClass = 'mark';
  var markerHeight = '2px';
  var _color = 'currentColor';

  var containerY = container.offsetTop;
  var containerH = container.scrollHeight;

  var customStyle = document.createElement('style');
  container.appendChild(customStyle);

  var renderScrollMarker = ($parent, posArr) => {
    var _posArr = posArr.map(i => {
      return `transparent ${i}, ${_color} ${i}, ${_color} calc(${i} + ${markerHeight}), transparent calc(${i} + ${markerHeight})`;
    });

    customStyle.innerHTML = `article::-webkit-scrollbar-track {
        background-image: linear-gradient(${_posArr.join()});
      }`;
  };

  var calcEleRelativePos = ($ele) => {
    return ($ele.offsetTop - containerY) / containerH;
  };

  var markOpt = {
    className: markClass,
    done: function () {
      var marks = document.querySelectorAll(`.${markClass}`);
      var allY = [].map.call(marks, (mark) => {
        return (calcEleRelativePos(mark) * 100).toFixed(2) + '%';
      });
      renderScrollMarker(container, allY);
      console.log(allY);
    }
  };

  var instance = new Mark(container);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    var _text = input.value.trim();

    console.log(_text, form.oldText);

    if (_text === '') {
      instance.unmark(markOpt);
      return;
    }

    form.oldText = _text;
    instance.unmark().mark(_text, markOpt);
  });

  // trigger
  form.querySelector('input[type="submit"]').click();
})();
