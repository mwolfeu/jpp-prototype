const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const { keywords, kTypes, Main, Incident, Perpetrator } = require('./schemaCfg.js')

module.exports = class Schema {
  constructor() {
    this.validate = { encode: {}, decode: {} };
    this.schemaCfg = { Main, Incident, Perpetrator }

    this.ajv = new Ajv({ allErrors: true, removeAdditional: "all" }); // options can be passed, e.g. {allErrors: true}
    addFormats(this.ajv);

    // add user defined keywords
    Object.keys(keywords).forEach(d => {
      this.ajv.addKeyword({
        keyword: '$' + d,
        type: kTypes[d],
        modifying: true,
        error: { message: (d) => d['keyword'] + ": Invalid value, property deleted" }, // always be true, silently delete
        errors: true,
        compile: keywords[d]
      });
    });

  }

  coder(encode, cfg, lang, parentObj) {
    let schema = { type: "object", properties: {}, required: [] };
    if (!parentObj) parentObj = schema;

    cfg.forEach(d => {

      if (d.Type == "string" || d.Type == "code") {
        let o = { type: "string" };
        parentObj.properties[d.Name] = o;
        if (d.minLen) o.minLength = d.minLen;
        if (d.maxLen) o.maxLength = d.maxLen;
      }

      if (d.Type == "number") {
        let o = { type: d.Type };
        parentObj.properties[d.Name] = o;
      }

      if (d.Type == "integer") {
        let o = { type: d.Type };
        parentObj.properties[d.Name] = o;
      }

      if (d.Type == "array" || d.Type == "code-array") {
        let o = { type: "array" };
        parentObj.properties[d.Name] = o;
        if (d.minLen) o.minItems = d.minLen;
        if (d.maxLen) o.maxItems = d.maxLen;
        if (d.Type == "array") {
          o.items = { type: "object", properties: {}, required: [] };
          this.coder(encode, this.schemaCfg[d["Values-" + lang]], lang, o.items);
        }
      }

      if (d.Type == "boolean") {
        let o = { type: "string" };
        parentObj.properties[d.Name] = o;
      }

      if (d.Type == "object") {
        let o = { type: d.Type, properties: {}, required: [] };
        parentObj.properties[d.Name] = o;
      }

      if (d.Type == "date") { // imported format
        let o = { type: "string", format: d.Type };
        parentObj.properties[d.Name] = o;
      }

      // required
      if (d.Required) {
        parentObj.required.push(d.Name);
      }

      // 'other' handling
      // encode it as zero since you might want to add more options later
      let options;
      if (typeof d["Values-en"] == 'string') {
        options = d["Values-" + lang].split(',').map(d => d.trim());
        if (d["Values-en"].replace(/ /g, '').endsWith(',other')) { // put "other" at start
          let other = options.pop(); // in whatever language
          options = [other, ...options];
        }
      }

      // keyword additions
      if (encode) {
        if (d.Type == "code" || d.Type == "boolean") {
          // parentObj.properties[d.Name].type = "string"
          parentObj.properties[d.Name]['$encode'] = options; // d["Values-" + lang].split(',').map(d => d.trim());
        }
        if (d.Type == "code-array") {
          parentObj.properties[d.Name]['$encode-array'] = options; // dd["Values-" + lang].split(',').map(d => d.trim());
        }
      } else {
        if (d.Type == "code" || d.Type == "boolean") {
          parentObj.properties[d.Name].type = "integer"
          parentObj.properties[d.Name]['$decode'] = options; // dd["Values-" + lang].split(',').map(d => d.trim());
        }
        if (d.Type == "code-array") {
          parentObj.properties[d.Name]['$decode-array'] = options; // dd["Values-" + lang].split(',').map(d => d.trim());
        }
      }

    })

    return schema;
  }

  initValidator(type, lang) {
    if (!this.validate[type][lang]) {
      let schema = this.coder(type == "encode", this.schemaCfg.Main, lang);
      this.validate[type][lang] = this.ajv.compile(schema);
    }

    return this.validate[type][lang];
  }

  encode(d, lang) {

    let validate = this.initValidator("encode", lang);

    // let schema = coder(true, this.schemaCfg.Main, lang);
    // let validate = ajv.compile(schema)

    let valid = validate(d);

    return { valid, errors: validate.errors };
  }

  decode(d, lang) {

    let validate = this.initValidator("decode", lang);
    let valid = validate(d);

    return { valid, errors: validate.errors };
  }
}