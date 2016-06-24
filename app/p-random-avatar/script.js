var $$ = ($selector) => {
  return [].slice.call(document.querySelectorAll($selector));
};
var $ = ($selector) => {
  return document.querySelector($selector);
};

var random = (max, min = 0) => {
  return ~~(Math.random() * (max - min) + min);
};

class Avatar2 {
  constructor ($obj) {
    Object.assign(this, $obj);
  }

  setBgi ($el, $url) {
    $el.style.backgroundImage = $url;
  }

  resetClassName ($el, $className) {
    $el.className = $className;
  }

  loadNewImg ($newBgiUrl) {
    this.imgLoader.src = $newBgiUrl;
  }

  run () {
    setTimeout(() => {
      this.loadNewImg(this.getImgUrl(this.img, {'%s': ++this.count}));
    }, 1000);
  }

  updateState () {
    var idx = random(this.itemsNum - 1);
    var target = this.items[idx];
    var newBgi = `url(${this.imgLoader.src})`;

    target.newBgi = newBgi;
    this.setBgi(target.children[0], newBgi);
    target.classList.add('is-animating', this.aniType[random(this.aniTypeNum)]);
  }

  animationEnd (e) {
    var _target = e.target;
    if (_target.classList.contains('avatar--new')) { return; }

    this.setBgi(_target, _target.newBgi);
    this.resetClassName(_target, 'avatar');
    this.run();
  }

  randomColor () {
    return (~~(Math.random() * (1 << 24))).toString(16);
  }

  getImgUrl ($str, $matchObj) {
    Object.assign($matchObj, {'%c': this.randomColor()});

    for (let _p in $matchObj) {
      if ($matchObj.hasOwnProperty(_p)) {
        $str = $str.replace(new RegExp(_p, 'g'), $matchObj[_p]);
      }
    }

    return $str;
  }

  init () {
    this.items.forEach((item, index) => {
      item.style.backgroundImage = `url(${this.getImgUrl(this.img, {'%s': index + 1})})`;
    });

    this.box.addEventListener('animationend', this.animationEnd.bind(this), false);

    this.imgLoader = document.createElement('img');
    this.imgLoader.onload = this.updateState.bind(this);

    this.itemsNum = this.items.length;
    this.count = this.itemsNum;
    this.aniTypeNum = this.aniType.length;

    this.run();
  }
}

var avatar = new Avatar2({
  box: $('.box'),
  items: $$('.avatar'),
  aniType: ['t-b', 'b-t', 'l-r', 'r-l', 'fade'],
  img: 'http://placeskull.com/100/100/%c/%s/0'
});

avatar.init();
