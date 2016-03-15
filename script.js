/* global Mustache, location, fetch, console */

let Form = {};
Form.form = document.querySelector('.form');
Form.input = document.getElementById('js-cid');

if (location.search) {
  let cid = location.search.match(/cid=([^&]+)/);

  if (cid && cid[1]) {
    Form.input.value = cid[1];
  }
}

Form.form.addEventListener('submit', (e) => {
  e.preventDefault();
  let newId = Form.input.value.trim();

  if (Pen.collectionId !== Form.input.value.trim() || Pen.pens.length === 1) {
    Pen.init();
    Pen.getInfo();
  }
});

let Pen = {};

Pen.wrap = document.querySelector('.box');
Pen.tpl = document.getElementById('pen-tpl').innerHTML;
Pen.init = () => {
  Pen.wrap.innerHTML = '';
  Pen.pens = [0];
  Pen.page = 1;
  Pen.collectionId = Form.input.value.trim();
};

Pen.getInfo = () => {
  let url = `http://cpv2api.com/collection/${Pen.collectionId}/?page=${Pen.page}`;
  console.log(url);

  fetch(url)
  .then((_res) => _res.json())
  .then((res) => {
    if (!res.success) { return; }

    Pen.pens.push(res.data);
    Pen.render(Pen.page);

    if (res.data.length === 6) {
      Pen.page += 1;
      Pen.getInfo();
    }
  })
  .catch((error) => {
    console.log('There has been a problem with your fetch operation: ' + error.message);
  });
};

Pen.render = (order) => {
  let _html = `<hr><a class="pagenation" href="http://codepen.io/collection/${Pen.collectionId}/${order}">page: #${order}</a>`;
  console.log(`now is: ${order}`);

  Pen.pens[order].forEach((penData) => {
    _html += Mustache.render(Pen.tpl, penData);
  });

  Pen.wrap.insertAdjacentHTML('beforeend', _html);
};

Pen.init();
Pen.getInfo();
