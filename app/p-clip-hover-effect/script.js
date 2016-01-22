let items = document.getElementsByClassName('item');
let masks = document.getElementsByClassName('figure__mask');

let calcTouchPos = ($pos, $item, $i) => {
  let rect = $item.rect;
  let x = ~~Math.min(Math.max($pos.clientX - rect.left, 0), 300);
  let y = ~~Math.min(Math.max($pos.clientY - rect.top, 0), 200);
  masks[$i].style.transform = `translate(${x}px, ${y}px)`;
};

let isSupportTouch = 'ontouchstart' in window;

[].forEach.call(items, (item, i) => {
  item.addEventListener('mousemove', (e) => {
    masks[i].style.transform = `translate(${e.offsetX}px, ${e.offsetY}px)`;
  }, false);

  if (isSupportTouch) {
    item.addEventListener('touchstart', (e) => {
      let pos = e.targetTouches[0];
      let target = document.elementFromPoint(pos.clientX, pos.clientY);
      item.rect = target.getBoundingClientRect();
    });

    item.addEventListener('touchmove', (e) => {
      e.preventDefault();
      calcTouchPos(e.targetTouches[0], item, i);
    });
  }
});
