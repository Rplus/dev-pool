/* global location */
(function () {
  var iframify = document.querySelectorAll('.iframify');

  if (!iframify.length) {
    return;
  }

  if (!location.hash) {
    window.iframifyResize = (iframe) => {
      iframe.height = iframe.contentWindow.document.documentElement.offsetHeight;
    };

    [].forEach.call(iframify, (item, i) => {
      var width = item.getAttribute('data-width');
      item.insertAdjacentHTML('afterend', `<iframe src="${location.href}/#iframify-${i}" width="${width}" frameborder="0" onload="iframifyResize(this)">`);
    });
  } else {
    var index = +location.hash.replace('#iframify-', '');
    document.body.style.margin = 0;
    document.body.innerHTML = iframify[index].innerHTML; // clear other node
  }
})();
