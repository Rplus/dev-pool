/* globals Clipboard */

let corner = {
  tpl: document.getElementById('corner-tpl').textContent.trim(),
  textarea: document.getElementById('textarea'),
  target: document.getElementById('apply')
};

corner.form = document.getElementById('corner-opts');

let update = function () {
  let color = corner.form.color.value;
  let fill = corner.form.fill.value;
  let transparent = corner.form.transparent.value;
  let size = corner.form.size.value;
  let url = corner.form.url.value;

  let [ay, ax] = corner.form.opts_pos.value.split('').map(function (i) {
    return i === '+' ? 1 : -1;
  });

  let trans = (ay === 1 && ax === 1) ? '' : `transform: scale(${ax},${ay});`;

  let dirX = ax > 0 ? 'right' : 'left';
  let dirY = ay > 0 ? 'top' : 'bottom';

  if (transparent !== '') {
    transparent = `mix-blend-mode:${transparent};`;
  }

  let _tpl =
    corner.tpl

      // replace
      .replace(/\${url}/, url)
      .replace(/\${size}/g, size)
      .replace(/\${fill}/, fill)
      .replace(/\${color}/, color)
      .replace(/\${trans}/, trans)
      .replace(/\${dirX}/, dirX)
      .replace(/\${dirY}/, dirY)
      .replace(/\${mixBlendMode}/, transparent)

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
