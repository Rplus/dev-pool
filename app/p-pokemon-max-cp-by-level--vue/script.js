/* globals localStorage, fetch, Vue */

// const BEST_PROPERTY = 15;
const MAX_LV = 40;
const WILD_PM_MAX_LV = 30;
const VERSION = '2016-11-22';

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
  pokeData: 'https://cdn.rawgit.com/Rplus/358fd8f680dd2d5945c80826dfcdd599/raw/b97cfb0cccf61a119b521f43df4d449fc0eaa5f2/baseStats.json',
  levelCpMultiplier: 'https://cdn.rawgit.com/Rplus/a4f16be334a5a458144c1fc425034ed3/raw/ced3970da1e6eed8b7fc4512bc2231159ad4cbde/levelCpMultiplier.json'
};

// for dev
if (/^\/_dist/.test(window.location.pathname)) {
  for (var name in upstreamUrls) {
    upstreamUrls[name] = upstreamUrls[name].match(/.*\/(.+?\.json)$/)[1];
  }
}

// source: https://github.com/vinnymac/PokeNurse/blob/v1.5.4/app/utils.js#L164-L170
let getMaxCpForTrainerLevel = (poke, pmLv) => {
  let _iv = vm.iv;
  let maxPokemonLevel = Math.min(MAX_LV, pmLv);
  let maxCpMultiplier = localData.levelCpMultiplier[maxPokemonLevel];
  let ADS = (poke.BaseAttack + _iv.attack) * Math.pow((poke.BaseDefense + _iv.defense) * (poke.BaseStamina + _iv.stamina), 0.5);
  let total = ADS * Math.pow(maxCpMultiplier, 2.0);
  return Math.floor(total / 10);
};

let vm = new Vue({
  el: '#pokeMaxCP',
  data: {
    trainerLevel: Math.min(MAX_LV, parseInt(window.location.search.match(/\d+/), 10) || MAX_LV),
    pmLv: WILD_PM_MAX_LV,
    isPmWild: true,
    filter: {
      type: null,
      familyId: 1
    },
    iv: {
      attack: 15,
      defense: 15,
      stamina: 15
    },
    sort: {
      by: 'id',
      dir: 1
    },
    pokemons: null
  },
  watch: {
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
    pmMaxLv () {
      return Math.min(this.isPmWild ? WILD_PM_MAX_LV : MAX_LV, this.trainerLevel + 1.5);
    }
  },
  methods: {
    getMaxCpForTrainerLevel,
    reCalcPmLv () {
      this.pmLv = Math.min.call(null, this.isPmWild ? WILD_PM_MAX_LV : MAX_LV, this.pmLv, this.pmMaxLv);
    },
    getPmMaxLv () {
      this.pmMaxLv = Math.min(MAX_LV, this.trainerLevel + 1.5);
    },
    selectFamily (familyId) {
      this.filter.familyId = familyId;
    },
    selectAll (all) {
      [].forEach.call(document.querySelectorAll('.ctrlFilter__checkbox'), (i) => {
        i.checked = all;
      });
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
  let pokemons = localData.pokeData.pokemon;

  pokemons = Object.keys(pokemons).map((i) => pokemons[i]);

  vm.pokemons = pokemons.map((poke, idx) => {
    let row = ~~(idx / 7);
    let col = idx % 7;

    poke.id = idx + 1;
    poke.familyId *= 1;
    poke.maxcp = getMaxCpForTrainerLevel(poke, MAX_LV);
    poke.spritePos = `${col * -65}px ${row * -65}px`;

    return poke;
  });
  vm.$mount('#pokeMaxCP');
};
