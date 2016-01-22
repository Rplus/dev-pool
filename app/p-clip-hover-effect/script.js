let items = document.getElementsByClassName('item');
let masks = document.getElementsByClassName('figure__mask');

[].forEach.call(items, (item, i) => {
  item.addEventListener('mousemove', (e) => {
    masks[i].style.transform = `translate(${e.offsetX}px, ${e.offsetY}px)`;
  }, false);
});

