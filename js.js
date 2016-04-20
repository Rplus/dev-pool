/* global location */
(function () {
  var iframify = document.querySelectorAll('.iframify');

  if (!iframify.length) {
    return;
  }

  if (!location.hash) {
    [].forEach.call(iframify, (item, i) => {
      var width = item.getAttribute('data-width');
      item.insertAdjacentHTML('afterend', `<iframe id="iframify-${i}" src="${location.href}/#iframify-${i}" width="${width}" frameborder="0" >`);
    });
  } else {
    var index = +location.hash.replace('#iframify-', '');
    document.body.style.margin = 0;
    document.body.innerHTML = iframify[index].innerHTML; // clear other node
    window.top.document.querySelector(`#iframify-${index}`).height = document.documentElement.offsetHeight;
  }
})();
