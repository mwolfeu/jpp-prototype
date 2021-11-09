/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
function mergeDeep(...objects) {
  const isObject = obj => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

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

globalThis.pGet = pGet;
globalThis.pSet = pSet;

export { mergeDeep, pSet, pGet }