/* globals fetch, Vue */

const levelCpMultiplier = {
  1: 0.094,
  1.5: 0.135137432,
  2: 0.16639787,
  2.5: 0.192650919,
  3: 0.21573247,
  3.5: 0.236572661,
  4: 0.25572005,
  4.5: 0.273530381,
  5: 0.29024988,
  5.5: 0.306057377,
  6: 0.3210876,
  6.5: 0.335445036,
  7: 0.34921268,
  7.5: 0.362457751,
  8: 0.37523559,
  8.5: 0.387592406,
  9: 0.39956728,
  9.5: 0.411193551,
  10: 0.42250001,
  10.5: 0.432926419,
  11: 0.44310755,
  11.5: 0.453059958,
  12: 0.46279839,
  12.5: 0.472336083,
  13: 0.48168495,
  13.5: 0.4908558,
  14: 0.49985844,
  14.5: 0.508701765,
  15: 0.51739395,
  15.5: 0.525942511,
  16: 0.53435433,
  16.5: 0.542635767,
  17: 0.55079269,
  17.5: 0.558830576,
  18: 0.56675452,
  18.5: 0.574569153,
  19: 0.58227891,
  19.5: 0.589887917,
  20: 0.59740001,
  20.5: 0.604818814,
  21: 0.61215729,
  21.5: 0.619399365,
  22: 0.62656713,
  22.5: 0.633644533,
  23: 0.64065295,
  23.5: 0.647576426,
  24: 0.65443563,
  24.5: 0.661214806,
  25: 0.667934,
  25.5: 0.674577537,
  26: 0.68116492,
  26.5: 0.687680648,
  27: 0.69414365,
  27.5: 0.700538673,
  28: 0.70688421,
  28.5: 0.713164996,
  29: 0.71939909,
  29.5: 0.725571552,
  30: 0.7317,
  30.5: 0.734741009,
  31: 0.73776948,
  31.5: 0.740785574,
  32: 0.74378943,
  32.5: 0.746781211,
  33: 0.74976104,
  33.5: 0.752729087,
  34: 0.75568551,
  34.5: 0.758630378,
  35: 0.76156384,
  35.5: 0.764486065,
  36: 0.76739717,
  36.5: 0.770297266,
  37: 0.7731865,
  37.5: 0.776064962,
  38: 0.77893275,
  38.5: 0.781790055,
  39: 0.78463697,
  39.5: 0.787473578,
  40: 0.79030001,
  40.5: 0.7931164
};

const BEST_PROPERTY = 15;

let pokeDataSrc = 'https://rawgit.com/vinnymac/PokeNurse/master/baseStats.json';

// for dev
pokeDataSrc = './baseStats.json';

// source: https://github.com/vinnymac/PokeNurse/blob/v1.5.4/app/utils.js#L164-L170
let getMaxCpForTrainerLevel = (poke, trainerLevel) => {
  let _iv = vm.iv;
  let maxPokemonLevel = Math.min(40, trainerLevel + 1.5);
  let maxCpMultiplier = levelCpMultiplier[maxPokemonLevel];
  let ADS = (poke.BaseAttack + _iv.attack) * Math.pow((poke.BaseDefense + _iv.defense) * (poke.BaseStamina + _iv.stamina), 0.5);
  let total = ADS * Math.pow(maxCpMultiplier, 2.0);
  return Math.floor(total / 10);
};

let vm = new Vue({
  el: '#pokeMaxCP',
  data: {
    level: parseInt(window.location.search.match(/\d+/), 10) || 40,
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
  methods: {
    getMaxCpForTrainerLevel,
    selectFamily: function (familyId) {
      this.filter.familyId = familyId;
    },
    selectAll: function (all) {
      [].forEach.call(document.querySelectorAll('.ctrlFilter__checkbox'), (i) => {
        i.checked = all;
      });
    },
    sortBy: function (by = 'id') {
      this.sort.dir *= (this.sort.by === by) ? -1 : 1;
      this.sort.by = by;
      let dir = this.sort.dir;

      this.pokemons.sort((a, b) => {
        return (a[by] * dir) - (b[by] * dir);
      });
    }
  }
});

fetch(pokeDataSrc)
  .then((d) => d.json())
  .then((d) => {
    let pokemons = d.pokemon;

    pokemons = Object.keys(pokemons).map((i) => pokemons[i]);

    vm.pokemons = pokemons.map((poke, idx) => {
      let row = ~~(idx / 7);
      let col = idx % 7;

      poke.id = idx + 1;
      poke.familyId *= 1;
      poke.maxcp = getMaxCpForTrainerLevel(poke, 40);
      poke.spritePos = `${col * -65}px ${row * -65}px`;

      return poke;
    });
    vm.$mount('#pokeMaxCP');
  });

