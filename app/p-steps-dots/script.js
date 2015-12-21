let $body = document.body;

let duration = window.getComputedStyle(document.getElementsByClassName('step')[0]).transitionDuration;

duration = {
  o: duration,
  number: parseFloat(duration)
};
duration.unit = duration.o.replace(duration.number, '');

let setDelay = ($node) => {
  let inputs = [].filter.call($node.parentNode.childNodes, (node) => {
    return node.tagName && node.tagName.toLowerCase() === 'input';
  });
  console.log(111, inputs);

  $node.checked = true;
};

$body.addEventListener('click', (e) => {
  // console.log(123);
  // let $target = e.target;

  // if ($target.tagName.toLowerCase() === 'input') {
  //   e.preventDefault();
  // }
  // setDelay($target);

  // let $origin;

  // let inputs = [].filter.call($target.parentNode.childNodes, (node) => {
  //   let isInput = node.tagName && node.tagName.toLowerCase() === 'input';

  //   if (!isInput) { return false; }

  //   if (node.getAttribute('checked')) {
  //     $origin = node;
  //     node.removeAttribute('checked');
  //   }

  //   return true;
  // });

  // let targetIndex = inputs.indexOf($target);
  // let originIndex = inputs.indexOf($origin);

  // let shift = targetIndex - originIndex;
  // let direction = shift > 0 ? 1 : -1;
  // let basicTime = duration.number / shift;

  // for (let i = shift; i !== 0; i -= direction) {
  //   inputs[originIndex + i].nextElementSibling.style.transitionDelay = basicTime * i + duration.unit;
  //   console.log(i, originIndex + i);
  // }

  // $target.setAttribute('checked', 'checked');
});
