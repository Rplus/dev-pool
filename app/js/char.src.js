/* global document, console, window */

(function () {
    'use strict';

    var allChars = document.getElementById('chars').textContent.trim().toUpperCase().split('');
    var outputArea = document.getElementById('output');
    var charTmp = '<div class="#{$char}" title="#{$char}"></div>';

    var allHtml = [];

    for (var i = allChars.length; i ;) {
        i--;

        allHtml.unshift(charTmp.replace(/#\{\$char\}/g, allChars[i]));
    }

    outputArea.innerHTML = allHtml.join('');
})();
