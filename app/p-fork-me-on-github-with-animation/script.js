/* globals Clipboard */

let corner = {
  tpl: document.getElementById('corner-tpl').textContent.trim(),
  textarea: document.getElementById('textarea'),
  target: document.getElementById('apply')
};

let animationStyle = `
  .github-corner:hover .octo-arm {
    animation: octocat-wave .56s;
  }
  @keyframes octocat-wave {
    0%, 100% {transform: rotate(0); }
    20%, 60% {transform: rotate(-20deg); }
    40%, 80% {transform: rotate(10deg); }
  }`;

corner.form = document.getElementById('corner-opts');

let update = function () {
  let color = corner.form.color.value;
  let fill = corner.form.fill.value;
  let transparent = corner.form.transparent.value;
  let _animationStyle = corner.form.animation.checked ? animationStyle : '';
  let size = corner.form.size.value;
  let url = corner.form.url.value;

  let [ay, ax] = [].filter.call(corner.form.opts_pos, i => i.checked)[0].value
    .split('').map(i => i === '+' ? 1 : -1);

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
      .replace(/\${animation}/, _animationStyle)

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
  corner.form.addEventListener('change', update);
  corner.form.addEventListener('reset', function () {
    setTimeout(update, 0);
  });
})();
