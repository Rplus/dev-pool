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
    this.elm.styleInitCP = document.querySelector('.pokeInitCP');
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
        this.initCPStyle();
        this.render();
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
            <span class="poke__cp" dd="${i.cp}"></span>
            <span class="poke__avatar" style="background-position: ${this.colRow(i.id)}"></span>
            <span class="poke__name">${i.name}</span>
          </label>
        </li>`;
    }).join('');
  }

  initCPStyle () {
    this.elm.wrapper.style.counterReset = this.data.map((i) => {
      return `pokecp-${i.id} ${i.maxcp}`;
    }).join(' ');

    let _style = this.data.map((i) => {
      return `
        .poke[data-id="${i.id}"] .poke__cp::before { content: counter(pokecp-${i.id}) }`;
    }).join('');

    this.elm.styleInitCP.textContent = _style;
  }

  updateCPStyle () {
    console.log('upupup', this.MAX_LV - this.level);
    this.elm.wrapper.style.counterIncrement = this.data.map((i) => {
      return `pokecp-${i.id} -${i.cpPerLv * (this.MAX_LV - this.level)}`;
    }).join(' ');
  }

  updateData (_data = this.oriData) {
    this.data = _data.map((i) => {
      i.cp = ~~(i.maxcp - (this.MAX_LV - this.level) * i.cpPerLv);
      return i;
    });
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
      this.updateCPStyle();
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
