;(function($) {
  'use strict';

  var $iphone = $('.iphone');
  var $tabsInput = $iphone.find('.ctrl-input');
  var $jelly = $iphone.find('.nav__jelly');

  var jellyNowIndex;

  var init = (function() {
    var checkedIndex = $tabsInput.filter('[checked]').index();

    // not macthed
    if (-1 === checkedIndex) {
      checkedIndex = 0;
      $tabsInput.eq(checkedIndex).attr('checked', true);
    }

    jellyNowIndex = checkedIndex;
  })();

  $iphone.on('change', '.ctrl-input', function(event) {
    var targetTabIndex = $(event.target).index();
    var dir = (jellyNowIndex > targetTabIndex) ? 'left' : 'right';

    // use attr because CSS need this attribute
    $jelly.attr('data-dir', dir);

    jellyNowIndex = targetTabIndex;
  });

})(jQuery);
