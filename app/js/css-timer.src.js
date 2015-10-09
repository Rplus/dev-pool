let eles = {
  ctrls: document.getElementsByName('ctrl'),
  diff: document.getElementById('js-diff')
};

let prePadding0 = function($_str = 0, $_digi = 6) {
  return ('0'.repeat($_digi) + $_str).slice(-$_digi);
};

let timer = {
  start: 0,
  prevTime: 0,
  ctrler: function($_status) {
    if ('play' === $_status) {
      this.start = +new Date();
      eles.diff.innerHTML = prePadding0(this.prevTime);
    } else if ('pause' === $_status) {
      let _now = +new Date();
      let _start = this.start;
      _start = _start ? _start : _now;
      this.prevTime += _now - _start;
      eles.diff.innerHTML = prePadding0(this.prevTime);
    } else {
      this.start = 0;
      this.prevTime = 0;
      eles.diff.innerHTML = prePadding0();
    }
  }
};

[].forEach.call(eles.ctrls, function($_ctrl) {
  $_ctrl.addEventListener('change', function() {
    timer.ctrler($_ctrl.value);
  });
});
