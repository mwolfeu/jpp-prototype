// import { layout } from "../../frontend/js/entry.js";
require("./entry.js");
let layout = globalThis.schema.layout;

// Data dictionary sheets - as of 29/11/21
module.exports = layout;

// AJV schema - user defined keywords
module.exports.keywords = {

  encode: function(sch, parentSchema) {
    return function(data, obj) {
      let key = obj.parentDataProperty;

      obj.parentData[key] = sch.indexOf(obj.parentData[key]);
      if (obj.parentData[key] == undefined) {
        delete(obj.parentData[key])
        return false
      }

      return true;
    }
  },

  "encode-array": function(sch, parentSchema) {
    return function(data, obj, a) {
      let key = obj.parentDataProperty;
      obj.parentData[key] =
        obj.parentData[key].map(d => sch.indexOf(d));

      if (obj.parentData[obj.parentDataProperty].includes(-1)) {
        delete(obj.parentData[key])
        return false
      }

      return true;
    }
  },

  decode: function(sch, parentSchema) {
    return function(data, obj) {
      let key = obj.parentDataProperty;
      obj.parentData[key] = sch[obj.parentData[key]];
      if (obj.parentData[key] == undefined) {
        delete(obj.parentData[key])
        return false
      }

      return true;
    }
  },

  "decode-array": function(sch, parentSchema) {

    return function(data, obj, a) {
      let key = obj.parentDataProperty;
      obj.parentData[key] =
        obj.parentData[key].map(d => sch[d]);

      if (obj.parentData[obj.parentDataProperty].includes(undefined)) {
        delete(obj.parentData[key])
        return false
      }

      return true;
    }
  },

}

module.exports.kTypes = {
  "encode": "string",
  "encode-array": "array",
  "decode": "integer",
  "decode-array": "array"
}