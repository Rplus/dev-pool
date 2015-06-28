/* global $, document, console, window */

(function () {
  'use strict';

  var $mobileWrap = document.querySelector('.mobile-wrap');
  var $mainHeader = document.querySelector('.main-header');
  var $toolbar = document.querySelector('.toolbar');
  var $minimap = document.querySelector('.minimap');
  var $miniLists = document.querySelector('.mini-lists');
  var $miniList = document.querySelectorAll('.mini-list');
  var $mainContent = document.querySelector('.main-content');
  var $listsWrap = document.querySelector('.lists-wrap');
  var $lists = document.querySelector('.lists');
  var $list = document.querySelectorAll('.list');
  var $listItems = document.querySelectorAll('.list-items');
  var $clickCircle = document.querySelector('.click-circle');
  var $listHeader = document.querySelector('.list-header');

  var _mainHeaderTop = $mainHeader.getBoundingClientRect().top;
  var _mobileWrapWidth = $mobileWrap.getBoundingClientRect().width;
  var _docWidth = document.documentElement.clientWidth;
  var _miniListsWidth = 60 * $miniList.length / 0.85; // 15% margin-left
  var _listGap = $list[1].getBoundingClientRect().left - $list[0].getBoundingClientRect().left; // 15% margin-left
  var _listLen = $list.length;

  var currentIndex = 0;
  var newIndex = 0;

  // minimap state
  var minimapClass = ['', 'is-mini', 'is-mini is-hidden'];
  var minimapClassLen = minimapClass.length;
  var minimapClassCount = 1;

  var setMiniMapState = function(dir) {
    dir = (dir > 0) ? 1 : -1;
    if (minimapClassCount === minimapClassLen - 1 && 1 === dir) { return; }
    minimapClassCount = (minimapClassCount + dir) % minimapClassLen;
    $mainContent.className = 'main-content ' + minimapClass[minimapClassCount];
  };

  // var getIndex = function(node) {
  //   var i = 0;
  //   while(node.previousSibling){
  //     node = node.previousSibling;
  //     if(node.nodeType === 1) {
  //       i++;
  //     }
  //   }
  //   return i;
  // };

  var updateMinimapScroll = function() {
    console.log(1111111111111);

    var x = Math.round((_miniListsWidth - _mobileWrapWidth) * newIndex / ($miniList.length - 1));

    console.log(x);
    var shiftX = function(dx) {
      $minimap.scrollLeft = dx;
    };

    var _x = $minimap.scrollLeft;
    (function animloop(){
      var dir = (_x > x) ? -1 : 1;
      var step = dir * 10;
      if ((x - _x) * dir > (step * dir - 1)) {
        shiftX(_x + step);
        window.requestAnimationFrame(animloop);
      } else {
        shiftX(x);
      }
      _x += step;
    })();
  };

  var switcher = function(_newIndex) {
    newIndex = _newIndex;

    // avoid switching to currentItem
    if (newIndex === currentIndex) { return; }

    [].forEach.call($miniList, function(_list, v) {
      _list.classList.remove('active');
    });

    $miniList[newIndex].classList.add('active');

    updateMinimapScroll();

    $lists.style.transform = 'translateX(-' + _listGap * (newIndex) + 'px)';

    currentIndex = _newIndex;

    // minify minimap
    if (minimapClassCount === 0) {
      setMiniMapState(1);
    }
  };

  $('.list-item').on('scroll', function(event) {
    console.log(11111);
  });


  ///
  ///
  ///

  $clickCircle.addEventListener('animationend', function() {
    $clickCircle.classList.remove('active');
  });



  $miniLists.addEventListener('click', function(e) {
    var _this = e.target;

    // cirecle position & animation
    $clickCircle.classList.remove('active');
    $clickCircle.style.cssText = 'top: ' + e.pageY + 'px; left: ' + e.pageX + 'px;';
    $clickCircle.classList.add('active');

    if (_this.classList.contains('mini-list')) {
      switcher($(_this).index());
    }
  });



  $($lists).on('click', '.list', function(event) {
    switcher($(this).index());
  });


  // $($listItems).on('scroll', function(event) {
  //   if (0 === this.scrollTop) {
  //     setMiniMapState(-1);
  //   } else {
  //     console.log(minimapClassCount);
  //     setMiniMapState(1);
  //   }
  // });


  var init = (function() {
    var _listItemHeight = (function() {
      var _maxHeight = 0;
      [].forEach.call($listItems, function(_item) {
        _maxHeight = _item.scrollHeight > _maxHeight ? _item.scrollHeight : _maxHeight;
      });
      return _maxHeight;
    })();

    // sync height
    [].forEach.call($listItems, function(_item) {
      $miniList[$(_item).parent().index()].style.height = (100 * _item.scrollHeight / _listItemHeight) + '%';
    });
  })();

  // swipe detect ref.:  http://stackoverflow.com/a/23230280

  $listsWrap.addEventListener('touchstart', handleTouchStart, true);
  $listsWrap.addEventListener('touchmove', handleTouchMove, true);

  // $mainContent.addEventListener('mousedown', handleTouchStart, true);
  // $mainContent.addEventListener('mousemove', handleTouchMove, true);
  // $mainContent.addEventListener('mouseup', handleTouchEnd, true);

  var xDown = null;
  var yDown = null;
  var swipStartEle;

  function handleTouchStart(evt) {
    console.log('handleTouchStart');
    var _target = $(evt.target);

    // if (_target.hasClass('list-header') || _target.parents('.list-header').length) { return; }
    // console.log(_target, 333);

    if ('touchstart' === evt.type) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
    } else {
      xDown = evt.clientX;
      yDown = evt.clientY;
    }

    swipStartEle = evt.target;
  }

  function handleTouchEnd(evt) {
    xDown = null;
    yDown = null;
  }

  function handleTouchMove(evt) {
    var xUp ,yUp;

    if ( ! xDown || ! yDown ) {
      return;
    }

    if ('touchmove' === evt.type) {
      xUp = evt.touches[0].clientX;
      yUp = evt.touches[0].clientY;
    } else {
      xUp = evt.clientX;
      yUp = evt.clientY;
    }

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
      if ( xDiff > 0 ) {
        // ledt
        switcher(Math.min(currentIndex + 1, _listLen - 1));
      } else {
        // right
        switcher(Math.max(currentIndex - 1, 0));
      }
    } else {
      if ( yDiff > 0 ) {
        // up
        setMiniMapState(1);
      } else {
        // down
        console.log(evt.target);
        if (swipStartEle.classList.contains('list-header') || $(swipStartEle).parents('.list-header').length) {
          setMiniMapState(-1);
          updateMinimapScroll();
        }
      }
    }

    /* reset values */
    xDown = null;
    yDown = null;
  }

})();
