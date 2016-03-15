/* global fetch, console */
let lib;
let $form = document.querySelector('form');
let $btn = document.querySelector('button');
let [$input, $output] = [].slice.call(document.querySelectorAll('input'));

$form.addEventListener('submit', (e) => {
  e.preventDefault();

  console.log($input.value);

  let inputStrings = $input.value.toLowerCase().split(/\s+?/);
  let inputStringsTranslated = [];

  console.log(inputStrings);

  inputStrings.forEach((str) => {
    let mapedStr = str;
    lib.some((word) => {
      if (word.w.toLowerCase() === str) {
        mapedStr = word.r;
      }
    });
    inputStringsTranslated.push(mapedStr);
  });

  console.log(inputStringsTranslated);

  $output.value = inputStringsTranslated.join(' ');
});

fetch('./library.json')
.then((res) => res.json())
.then((data) => {
  lib = data;
  $btn.click();
})
.catch((error) => {
  console.log('There has been a problem with your fetch operation: ' + error.message);
});
