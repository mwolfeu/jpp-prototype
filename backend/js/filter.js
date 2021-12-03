const { regions } = require('./Web Project Data Dictionary - Regions.js')

// Get an object path value w defaults
function pGet(obj, path, mode) {
  let opts = {
    oVal: { badPathRvDef: {}, goodPathRvAs: d => d },
    aVal: { badPathRvDef: [], goodPathRvAs: d => d },
    aKey: { badPathRvDef: [], goodPathRvAs: d => Object.keys(d) },
    uVal: { badPathRvDef: undefined, goodPathRvAs: d => d },
    uKey: { badPathRvDef: undefined, goodPathRvAs: d => Object.keys(d) }
  };
  let def = opts[mode || "oVal"].badPathRvDef;

  let byName = path.split('.');
  for (let i = 0; i < byName.length; i++) {
    obj = obj[byName[i]];
    if (obj == undefined) return def;
  }

  return opts[mode || "oVal"].goodPathRvAs(obj);
}

// Set an object path value
function pSet(obj, path, val) {
  if (!path) return;

  let byName = path.split('.');
  for (let i = 0; i < byName.length - 1; i++) {
    if (!(byName[i] in obj)) obj[byName[i]] = {};
    obj = obj[byName[i]];
  }
  obj[byName.pop()] = val;
}

// add province entries containing sums of categories/options for all districts
// add a district "regional" category containing sum by province
// add country sums by province
let sumRegions = function(data, provinces, keys) {
  data.pakistan = {
    region: {},
    total: { value: 0 }
  }; // add country

  provinces.forEach(d => {
    let provinceTotal = 0;
    let districts = keys.filter(e => e.startsWith(d));
    if (!pGet(data, d, 'uVal')) data[d] == {};

    districts.forEach(e => {
      let districtTotal = 0;
      let distCatKeys = pGet(data, e, "aKey");
      distCatKeys.forEach(f => {
        let disCatOptKeys = pGet(data[e], f, "aKey");
        disCatOptKeys.forEach(g => {
          let pre = pGet(data, `${d}.${f}.${g}`, "uVal") || 0;
          let cur = pGet(data[e], `${f}.${g}`, "uVal") || 0;
          pSet(data, `${d}.${f}.${g}`, pre + cur);
          districtTotal += cur;
        });
        pSet(data, `${e}.region.${d}`, districtTotal);
      });
      provinceTotal += districtTotal;
    });

    data.pakistan.region[d] = provinceTotal; // add province total
    data.pakistan.total.value += provinceTotal;
  });
}

module.exports = class Filter {
  regionAggregates() {
    let rv = {}
    regions.forEach(d => {
      rv[d.name] = { gender: {} };
      ["female", "male", "transgender"].forEach(e =>
        rv[d.name].gender[e] = Math.round(Math.random() * 10)
      )
    });

    let keys = Object.keys(rv); // province ~ district combos
    let provinces = [...new Set(keys.map(d => d.split('~')[0]))];
    sumRegions(rv, provinces, keys);
    return rv; // return provinces too
  }
}