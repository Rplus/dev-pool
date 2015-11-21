/* globals Clipboard */

let corner = {
  tpl: document.getElementById('corner-tpl').innerText.trim(),
  textarea: document.getElementById('textarea'),
  target: document.getElementById('apply')
};

corner.form = document.getElementById('corner-opts');

let update = function () {
  let color = corner.form.color.value;
  let size = corner.form.size.value;
  let url = corner.form.url.value;

  let [ay, ax] = corner.form.opts_pos.value.split('.').map(function (i) {
    return i === '+' ? 1 : -1;
  });

  let dirX = ax > 0 ? 'right' : 'left';
  let dirY = ay > 0 ? 'top' : 'bottom';

  let trans = `translate(${ax * 50}%, ${ay * -50}%)
                rotate(${ax * (2 - ay) * 45}deg)`;

  let _tpl =
    corner.tpl

      // replace
      .replace(/\${url}/, url)
      .replace(/\${size}/g, size)
      .replace(/\${color}/, color)
      .replace(/\${trans}/, trans)
      .replace(/\${dirX}/, dirX)
      .replace(/\${dirY}/, dirY)

      // minify
      .replace(/\s*([:{}; ])\s*/g, '$1')
      .replace(/>\s+?</g, '><');

  corner.target.innerHTML = corner.textarea.value = _tpl;
};

// init
(function () {
  update();

  // bind events
  new Clipboard('.btn');
  corner.form.addEventListener('input', update);
  corner.form.addEventListener('reset', function () {
    setTimeout(update, 0);
  });
  corner.form.getElementsByTagName('table')[0].addEventListener('change', update);
})();
