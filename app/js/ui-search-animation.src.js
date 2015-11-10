/* global window, document, console, jQuery */

jQuery(function($) {
  'use strict';

  var eles = {};

  eles.box = document.querySelector('.box');
  eles.headerTxt = eles.box.querySelector('.header__txt');
  eles.searchForm = eles.box.querySelector('.search');
  eles.searchInput = eles.searchForm.querySelector('.search__input');
  eles.result = eles.box.querySelector('.result');
  eles.resultItem = eles.result.querySelector('.result__item');

  var resultItemTpl = eles.resultItem.outerHTML;
  var searchURL = eles.searchForm.action;

  var search = function() {
    eles.result.innerHTML = '';
    eles.box.classList.remove('is-loaded');
    eles.box.classList.add('is-searching');

    var queryString = eles.searchInput.value;

    // jquery
    $.getJSON(searchURL, {q: queryString})
    .done(function(data) {
      var countLimit = ~~(Math.random() * 10) + 3;
      var items = data.items.slice(0, 1000);

      var results = [];
      var i = 0;

      if (data.incomplete_results || !items.length) {
        items = [
          {
            full_name: 'no result!',
            html_url: '###'
          }
        ];
      }

      var itemsLen = items.length;

      for (; i < itemsLen; i++) {
        results[i] = resultItemTpl.replace(/(<a[^>]+?)>.+?(<\/a>)/, '$1 href="' + items[i].html_url + '">' + items[i].full_name + '$2');
      }
      eles.result.innerHTML = results.join('');

      setTimeout(function() {
        eles.headerTxt.innerText = queryString;
        eles.headerTxt.setAttribute('data-count', itemsLen);
        eles.box.classList.remove('is-searching');
        eles.box.classList.add('is-loaded');
      }, 1000);
    });

    resetSearch();
  };

  var resetSearch = function() {
    eles.searchInput.value = '';
    $(eles.searchInput).blur(); // jquery
  };

  eles.searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    search();
  });

  eles.searchInput.addEventListener('focus', function() {
    eles.box.classList.add('is-focus-input');
  });

  eles.searchInput.addEventListener('blur', function() {
    eles.box.classList.remove('is-focus-input');
  });

});
