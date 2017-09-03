/* global Vue */

const TrainerLevel = 35;
const NOW = new Date();
const timezoneOffset = NOW.getTimezoneOffset() * 60 * 1000;
const ONE_WEEK_IN_SECOND = (7 * 24 * 60 * 60 * 1000);

const PM_LV_OVER = 1.5;
const spriteCol = 15;
let recentTime = ONE_WEEK_IN_SECOND * 1;

// data from https://pokeiv.net/
const dataUrl = (window.location.hostname === 'localhost') ? 'pm.json' : 'https://api.myjson.com/bins/ckwq1';

let levelCpMultiplier = {
  '1': 0.094,
  '1.5': 0.135137432,
  '2': 0.16639787,
  '2.5': 0.192650919,
  '3': 0.21573247,
  '3.5': 0.236572661,
  '4': 0.25572005,
  '4.5': 0.273530381,
  '5': 0.29024988,
  '5.5': 0.306057377,
  '6': 0.3210876,
  '6.5': 0.335445036,
  '7': 0.34921268,
  '7.5': 0.362457751,
  '8': 0.37523559,
  '8.5': 0.387592406,
  '9': 0.39956728,
  '9.5': 0.411193551,
  '10': 0.42250001,
  '10.5': 0.432926419,
  '11': 0.44310755,
  '11.5': 0.453059958,
  '12': 0.46279839,
  '12.5': 0.472336083,
  '13': 0.48168495,
  '13.5': 0.4908558,
  '14': 0.49985844,
  '14.5': 0.508701765,
  '15': 0.51739395,
  '15.5': 0.525942511,
  '16': 0.53435433,
  '16.5': 0.542635767,
  '17': 0.55079269,
  '17.5': 0.558830576,
  '18': 0.56675452,
  '18.5': 0.574569153,
  '19': 0.58227891,
  '19.5': 0.589887917,
  '20': 0.59740001,
  '20.5': 0.604818814,
  '21': 0.61215729,
  '21.5': 0.619399365,
  '22': 0.62656713,
  '22.5': 0.633644533,
  '23': 0.64065295,
  '23.5': 0.647576426,
  '24': 0.65443563,
  '24.5': 0.661214806,
  '25': 0.667934,
  '25.5': 0.674577537,
  '26': 0.68116492,
  '26.5': 0.687680648,
  '27': 0.69414365,
  '27.5': 0.700538673,
  '28': 0.70688421,
  '28.5': 0.713164996,
  '29': 0.71939909,
  '29.5': 0.725571552,
  '30': 0.7317,
  '30.5': 0.734741009,
  '31': 0.73776948,
  '31.5': 0.740785574,
  '32': 0.74378943,
  '32.5': 0.746781211,
  '33': 0.74976104,
  '33.5': 0.752729087,
  '34': 0.75568551,
  '34.5': 0.758630378,
  '35': 0.76156384,
  '35.5': 0.764486065,
  '36': 0.76739717,
  '36.5': 0.770297266,
  '37': 0.7731865,
  '37.5': 0.776064962,
  '38': 0.77893275,
  '38.5': 0.781790055,
  '39': 0.78463697,
  '39.5': 0.787473578,
  '40': 0.79030001,
  '40.5': 0.7931164
};

let getPR = (value, decimals = 0) => {
  let base = Math.pow(10, decimals);
  return (~~(value * 100 * base)) / base;
};

let timeFormater = (time) => {
  return (new Date(time - timezoneOffset)).toJSON().split('.')[0];
};

let getCpWithLv = (pm, lv) => {
  let maxCpMultiplier = levelCpMultiplier[lv];
  let ADS = (pm.atk + pm.iv_attack) * Math.pow((pm.def + pm.iv_defence) * (pm.stm + pm.iv_stamina), 0.5);
  let total = ADS * Math.pow(maxCpMultiplier, 2.0);
  return Math.floor(total / 10);
};

let getLv = (pm) => {
  let pmlv;
  let cp = pm.cp;
  Object.keys(levelCpMultiplier).some((lv) => {
    if (cp === getCpWithLv(pm, lv)) {
      pmlv = lv;
      return true;
    }
  });
  return pmlv;
};

let groupBySpecies = ({pms = window.PMs, sortBy = 'cp', sortDir = -1} = {}) => {
  return pms.sort((a, b) => {
    return +(a[sortBy] > +b[sortBy]) ? (1 * sortDir) : (-1 * sortDir);
  }).reduce((all, pm) => {
    if (!all[pm.pokemon_id]) {
      all[pm.pokemon_id] = [];
    }
    all[pm.pokemon_id].push(pm);
    return all;
  }, []);
};

let handlePMdata = (pms) => {
  window.PMs = pms.map((pm) => {
    pm.id = `00${pm.pokemon_id}`.slice(-3);
    // pm.avatar = `https://images.weserv.nl/?url=pokeiv.net/img/pokemons/${pm.id}.gif&il&w=100`;
    pm.name = `${pm.name_en} / ${pm.name_zh_tw}`;
    pm.time = timeFormater(pm.catch_date);
    pm.lv = getLv(pm) || 1;
    pm.recent = (NOW - pm.catch_date) < recentTime;
    pm.cpLvMax = getCpWithLv(pm, TrainerLevel + PM_LV_OVER);
    pm.cpLvBest = getCpWithLv({
      atk: pm.atk,
      def: pm.def,
      stm: pm.stm,
      iv_attack: 15,
      iv_defence: 15,
      iv_stamina: 15
    }, TrainerLevel + PM_LV_OVER);

    pm.rowStart = ~~((pm.pokemon_id - 1) / spriteCol);
    pm.colStart = (pm.pokemon_id - 1) % spriteCol;
    return pm;
  });

  return window.PMs;
};

let fakePmdata = {
  'pokemon_id': '--',
  'name_en': '--',
  'name_zh_tw': '--',
  'cp': '--',
  'iv_attack': 10,
  'iv_defence': 10,
  'iv_stamina': 10,
  'stm': '-',
  'atk': '-',
  'def': '-',
  'iv': '--',
  'weight': '-',
  'height': '-',
  'move1': '-',
  'move2': '-',
  'move1_en': '-',
  'move2_zh_tw': '-',
  'cp40': 2547,
  'cp40_all15': 2619,
  'id': '094',
  'avatar': 'https://images.weserv.nl/?url=pokeiv.net/img/pokemons/201.gif&il&w=100',
  'time': '2017-00-00T00:00:00',
  'lv': '-'
};

let $app;
let getRelatedTime = () => {
  return new Date(new Date() - recentTime - timezoneOffset).toJSON().split('.')[0];
};
let initApp = () => {
  $app = new Vue({
    el: '#pm-board',
    data: {
      loaded: false,
      sortDir: -1,
      sortBy: 'cp',
      weeks: 1,
      relatedTime: getRelatedTime(),
      pmBySpecies: [
        [ fakePmdata, fakePmdata ]
      ]
    },
    components: {
      'cp-bar': {
        template: '#cp-bar-tpl'
      }
    },
    watch: {
      sortBy: function (newBy) {
        this.pmBySpecies = groupBySpecies({
          sortBy: this.sortBy,
          sortDir: this.sortDir
        });
      },
      weeks: function (weeks) {
        recentTime = ONE_WEEK_IN_SECOND * weeks;
        this.relatedTime = getRelatedTime();
        handlePMdata(window.PMs);
      },
      sortDir: function (newDir) {
        this.pmBySpecies = groupBySpecies({
          sortBy: this.sortBy,
          sortDir: newDir
        });
      }
    },
    methods: {
      getPR: getPR
    }
  });
};

initApp();

window.fetch(dataUrl)
.then((d) => d.json())
.then(handlePMdata)
.then((pms) => {
  $app.loaded = true;
  $app.pmBySpecies = groupBySpecies();
});
