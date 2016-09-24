class PokemonTable {
  constructor () {
    this.MAX_LV = 40;
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

  colRow (num, grid = 10, size = -56) {
    return `${((num - 1) % grid) * size}px ${~~((num - 1) / grid) * size}px`;
  }

  render (_data = this.data, target = this.elm.tbody) {
    target.innerHTML = _data.map((i) => {
      return `
        <li class="poke" data-id="${i.id}">
          <label>
            <span class="poke__cp">${i.cp}</span>
            <span class="poke__avatar" style="background-position: ${this.colRow(i.id)}"></span>
            <span class="poke__name">${i.name}</span>
          </label>
        </li>`;
    }).join('');
  }

  updateData (_data = this.oriData) {
    this.data = _data.map((i) => {
      i.cp = ~~(i.maxcp - (this.MAX_LV - this.level) * i.cpPerLv);
      return i;
    });

    this.render();
  }

  updateLv () {
    this.level = +this.elm.masterLv.value || 40;
    this.levelRatio = this.level / this.MAX_LV;

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
