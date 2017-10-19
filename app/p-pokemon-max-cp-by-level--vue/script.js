/* globals localStorage, fetch, Vue */

// const BEST_PROPERTY = 15;
const MAX_LV = 40;
const WILD_PM_MAX_LV = 30;
const VERSION = '2017-10-19';
const ALL_TYPES = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];

let localVersion = localStorage.getItem(VERSION);
let isOutdated = !localVersion;
let localData = {
  pokeData: null,
  levelCpMultiplier: null
};

if (isOutdated) {
  localStorage.clear();
  localData = {};
}

let upstreamUrls = {
  pokeData: 'https://raw.githubusercontent.com/Rplus/pokemongo-json-pokedex/master/output/pokemon.json',
  levelCpMultiplier: 'https://cdn.rawgit.com/Rplus/a4f16be334a5a458144c1fc425034ed3/raw/ced3970da1e6eed8b7fc4512bc2231159ad4cbde/levelCpMultiplier.json'
};

// for dev
// if (/^\/_dist/.test(window.location.pathname)) {
//   for (var name in upstreamUrls) {
//     upstreamUrls[name] = upstreamUrls[name].match(/.*\/(.+?\.json)$/)[1];
//   }
// }

// source: https://github.com/vinnymac/PokeNurse/blob/v1.5.4/app/utils.js#L164-L170
let getMaxCpForTrainerLevel = (poke, pmLv) => {
  let _iv = vm.iv;
  let maxPokemonLevel = Math.min(MAX_LV, pmLv);
  let maxCpMultiplier = localData.levelCpMultiplier[maxPokemonLevel];
  let ADS = (poke.stats.baseAttack + _iv.attack) * Math.pow((poke.stats.baseDefense + _iv.defense) * (poke.stats.baseStamina + _iv.stamina), 0.5);
  let total = ADS * Math.pow(maxCpMultiplier, 2.0);
  poke.hp = Math.floor((poke.stats.baseStamina + _iv.stamina) * maxCpMultiplier);
  return Math.floor(total / 10);
};

let initData = {
  lv: MAX_LV
};

if (window.location.search) {
  try {
    initData = JSON.parse(decodeURIComponent(window.location.search.slice(1)));
  } catch (e) {
    console.error(e);
  }
}

let vm = new Vue({
  el: '#pokeMaxCP',
  data: {
    trainerLevel: initData.lv,
    pmLv: initData.pmLv || WILD_PM_MAX_LV,
    isPmWild: initData.isPmWild !== undefined ? initData.isPmWild : true,
    filter: {
      type: initData.filter || ALL_TYPES,
      familyId: 1
    },
    iv: {
      attack: 15,
      defense: 15,
      stamina: 15,
      ...initData.iv
    },
    sort: {
      by: 'id',
      dir: 1
    },
    pokemons: []
  },
  watch: {
    'iv': {
      deep: true,
      handler: function () {
        this.updateURL();
      }
    },
    'filter': {
      deep: true,
      handler: function () {
        this.updateURL();
      }
    },
    trainerLevel () {
      this.reCalcPmLv();
    },
    isPmWild () {
      this.reCalcPmLv();
    },
    pmLv () {
      this.reCalcPmLv();
    }
  },
  computed: {
    pmWidthRatio () {
      return `${this.pmMaxLv * 100 / MAX_LV}%`;
    },
    getIv () {
      return ((this.iv.attack + this.iv.defense + this.iv.stamina) * 100 / 45).toFixed();
    },
    pmMaxLv () {
      return Math.min(this.isPmWild ? WILD_PM_MAX_LV : MAX_LV, this.trainerLevel + 1.5);
    }
  },
  methods: {
    getMaxCpForTrainerLevel,
    updateURL () {
      let o = {
        lv: this.trainerLevel,
        pmLv: this.pmLv,
        isPmWild: this.isPmWild,
        iv: this.iv,
        filter: this.filter.type
      };
      window.history.pushState(null, '', `?${encodeURIComponent(JSON.stringify(o))}`);
    },
    reCalcPmLv () {
      this.pmLv = Math.min.call(null, this.isPmWild ? WILD_PM_MAX_LV : MAX_LV, this.pmLv, this.pmMaxLv);
      this.updateURL();
    },
    getPmMaxLv () {
      this.pmMaxLv = Math.min(MAX_LV, this.trainerLevel + 1.5);
    },
    selectFamily (familyId) {
      this.filter.familyId = familyId;
    },
    selectAll (all) {
      if (all) {
        this.filter.type = ALL_TYPES;
      } else {
        this.filter.type = [];
      }
    },
    sortBy (by = 'id') {
      this.sort.dir *= (this.sort.by === by) ? -1 : 1;
      this.sort.by = by;
      let dir = this.sort.dir;

      this.pokemons.sort((a, b) => {
        return (a[by] * dir) - (b[by] * dir);
      });
    }
  }
});

let getData = (name) => {
  return new Promise((resolve, reject) => {
    if (isOutdated) {
      fetch(upstreamUrls[name])
        .then((d) => d.json())
        .then((d) => {
          if (name === 'pokeData') {
            d = d.concat(gen3GhostData);
          }
          localData[name] = d;
          resolve(d);
        });
    } else {
      let data = JSON.parse(localStorage.getItem(`${VERSION}-${name}`));
      localData[name] = data;
      resolve(data);
    }
  });
};

Promise.all([
  getData('pokeData'),
  getData('levelCpMultiplier')
]).then((results) => {
  handlePokeData();
  if (isOutdated) {
    localStorage.setItem(VERSION, true);
    for (var name in localData) {
      localStorage.setItem(`${VERSION}-${name}`, JSON.stringify(localData[name]));
    }
  }
});

let handlePokeData = () => {
  let pokemons = localData.pokeData;
  let colCount = Number(window.getComputedStyle(document.querySelector('.pokeMaxCP')).getPropertyValue('--sprite-grid-col'));
  let splite = window.getComputedStyle(document.querySelector('.poke__img'));
  let spliteWidth = parseFloat(splite.width);
  let spliteHeight = parseFloat(splite.height);

  vm.pokemons = pokemons.map((poke, idx) => {
    let dex = poke.dex;
    let index = dex - 1;
    let row = ~~(index / colCount);
    let col = index % colCount;

    poke.id = dex;
    poke.familyId = poke.family.id;
    poke.maxcp = getMaxCpForTrainerLevel(poke, MAX_LV);
    if (typeof poke.types[0] !== 'string') {
      poke.types = poke.types.reduce((all, v) => all.concat(v.name && v.name.toLowerCase()), []);
    }
    poke.spritePos = `${col * -spliteWidth}px ${row * -spliteHeight}px`;

    return poke;
  });
  vm.$mount('#pokeMaxCP');
};

let gen3GhostData = [
  {
    dex: 302,
    id: 'SABLEYE',
    name: 'Sableye',
    family: {
      id: 'FAMILY_SABLEYE',
      name: 'Sableye'
    },
    stats: {
      baseAttack: 141,
      baseDefense: 141,
      baseStamina: 100
    },
    types: [
      {
        name: 'Dark'
      },
      {
        name: 'Ghost'
      }
    ],
    maxCP: 1305
  },
  {
    dex: 353,
    id: 'SHUPPET',
    name: 'Shuppet',
    family: {
      id: 'FAMILY_SHUPPET',
      name: 'Shuppet'
    },
    stats: {
      baseAttack: 138,
      baseDefense: 66,
      baseStamina: 88
    },
    types: [
      {
        name: 'Ghost'
      }
    ],
    maxCP: 872
  },
  {
    dex: 354,
    id: 'BANETTE',
    name: 'Banette',
    family: {
      id: 'FAMILY_BANETTE',
      name: 'Banette'
    },
    stats: {
      baseAttack: 218,
      baseDefense: 127,
      baseStamina: 128
    },
    types: [
      {
        name: 'Ghost'
      }
    ],
    maxCP: 2073
  },
  {
    dex: 355,
    id: 'DUSKULL',
    name: 'Duskull',
    family: {
      id: 'FAMILY_DUSKULL',
      name: 'Duskull'
    },
    stats: {
      baseAttack: 70,
      baseDefense: 162,
      baseStamina: 40
    },
    types: [
      {
        name: 'Ghost'
      }
    ],
    maxCP: 523
  },
  {
    dex: 356,
    id: 'DUSCLOPS',
    name: 'Dusclops',
    family: {
      id: 'FAMILY_DUSCLOPS',
      name: 'Dusclops'
    },
    stats: {
      baseAttack: 124,
      baseDefense: 234,
      baseStamina: 80
    },
    types: [
      {
        name: 'Ghost'
      }
    ],
    maxCP: 1335
  }
];
