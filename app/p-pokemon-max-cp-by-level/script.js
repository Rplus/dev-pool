class PokemonTable {
  constructor () {
    this.MAX_CP = 40;
    this.hrefLvQueryRegex = /\blv=(\d+)/;
  }

  initElm () {
    this.elm = {};
    this.elm.wrapper = document.querySelector('.pokeMaxCP');
    this.elm.tbody = this.elm.wrapper.querySelector('.pokeList');
    this.elm.masterLv = this.elm.wrapper.querySelector('.pokeMaxCP__masterLv');
    this.elm.lvLabel = this.elm.wrapper.querySelector('.pokeMaxCP__masterLvLabel');
  }

  initLv () {
    let customMasterLv = window.location.hash.match(this.hrefLvQueryRegex);

    if (customMasterLv && customMasterLv.length >= 2) {
      this.elm.masterLv.value = customMasterLv[1];
    }

    this.updateLv();
  }

  fetch () {
    // same data with ./data-of-pokemons.json
    // window.fetch('https://api.myjson.com/bins/2w8ho')
    window.fetch('./data-of-pokemons.json')
      .then((d) => d.json())
      .then((data) => {
        this.oriData = data;
        this.updateData();
        this.bindLvInput();
      });
  }

  render (_data = this.data, target = this.elm.tbody) {
    target.innerHTML = _data.map((i) => {
      return `
        <li class="poke">
          <label>
            <span class="poke__cp">${i.cp}</span>
            <img class="poke__avatar" src="https://rankedboost.com/wp-content/themes/RB2/riot/poksimages/pokemontable/${('000' + i.id).slice(-3)}.png" />
            <span class="poke__name">${i.name}</span>
          </label>
        </li>`;
    }).join('');
  }

  updateData (_data = this.oriData) {
    this.data = _data.map((i) => {
      i.cp = ~~(i.maxcp - (this.MAX_CP - this.level) * i.cpPerLv);
      return i;
    });

    this.render();
  }

  updateLv () {
    this.level = +this.elm.masterLv.value || 40;
    this.levelRatio = this.level / this.MAX_CP;

    this.elm.lvLabel.dataset.lv = this.level;

    window.location.hash = window.location.hash.replace(this.hrefLvQueryRegex, `lv=${this.level}`);
  }

  bindLvInput () {
    this.elm.masterLv.addEventListener('input', () => {
      this.updateLv();
      this.updateData();
    });
  }

  init () {
    this.initElm();
    this.initLv();
    this.fetch();
  }
}

let pokeMaxCP = new PokemonTable();
pokeMaxCP.init();
