let imgBox = document.querySelector('.img-box');
let img = imgBox.querySelector('img');

img.onload = () => {
  setTimeout(() => {
    // imgBox.className = imgBox.className.replace('img-box--loading', 'img-box--done');
    imgBox.className = imgBox.className.replace('img-box--loading', '');
    console.log('done');
  }, 3000);
  console.log('loaded');
};

(() => {
  console.log('init');
  setTimeout(() => {
    imgBox.className += ' img-box--loading';
    img.src = img.getAttribute('data-src');
    console.log('start');
  }, 1000);
})();
