import "../../backend/js/entry.js"
let layout = globalThis.schema.layout;

class SurveyUtil {
  constructor() {

    this.valPrep = {
      single: (this.singlePrep).bind(this),
      multiple: (this.multiPrep).bind(this)
    }

    Survey
      .StylesManager
      .applyTheme("modern");
  }

  getLayout() {
    return layout;
  }

  // Build Survey
  init(cfg) {
    let { submitFcn } = cfg;
    this.lang = cfg.lang;
    // this.colNames = [];

    // Check if we are doing the short form or not
    let urlSearchParams = new URLSearchParams(window.location.search);
    this.isIntake = urlSearchParams.get("allQuestions") == null;
    if ('isIntake' in cfg) // override
      this.isIntake = cfg.isIntake

    // SURVEY ROOTS
    let paginated = {
      title: cfg.title,
      "completedHtml": cfg.completedHtml,
      showProgressBar: "top",
      "pages": [],
      "showQuestionNumbers": "on"
    };

    let json = paginated;

    //   let opts = {
    //     rvFcn: d => console.log("SURVEY POST", sender.data, d),
    //     method: 'POST',
    //     body: { data: sender.data, lang: navigator.language.split('-')[0] },
    //     url: cfg.url
    //   };
    //   submitFcn(opts);
    //   // this.aws.call('submitSurvey', { data: sender.data, lang: navigator.language.split('-')[0] }); // en, ur
    // }).bind(this);
    // function test(s, options) {
    //   // console.log(options);

    this.addItems(json, json.pages, json.pages, layout, layout.Main)
    this.surveyObj = this.render("surveyContainer", json, { onComplete: cfg.onComplete, onAfterRenderQuestionInput: cfg.onAfterRenderQuestionInput, });

  }

  clear() {
    this.surveyObj.clear();
  }

  render(el, json, handlers) {
    let survey = new Survey.Model(json);

    Object.keys(handlers).forEach(d => {
      survey[d].add(handlers[d]);
    })

    survey.render(el);
    return survey;
  }

  addPanelDynamic(elements, d) {
    let element = {
      "type": "paneldynamic",
      "name": d.Name,
      "title": d["Description-" + this.lang],
      "renderMode": "list",
      "templateTitle": `${d["Values-" + this.lang]} #{panelIndex}`,
      "templateElements": [],
      "panelCount": 1,
      "minPanelCount": 1,
      "panelAddText": `Add New ${d["Values-" + this.lang]}`,
      "panelRemoveText": `Remove ${d["Values-" + this.lang]}`,
    }
    if (parseInt(d.maxLen)) element.maxPanelCount = parseInt(d.maxLen);
    elements.push(element);
    return element.templateElements;
  }

  addItems(fn, pages, elements, templates, rows, indent) {
    let type = indent < 0 ? 'filter' : 'survey';

    // this.colNames.push(...rows.map(d => d.Name));

    if (!indent) indent = 0;

    let choicesByUrl = (function(d, item) {
      let val = this.valPrep[d.Input](d);
      if (val[0].startsWith('*')) {
        // item.choicesByUrl = {
        //   "url": `/jpp-prototype/data/Web Project Data Dictionary - ${val[0].slice(1)}.json`
        // }
        item.choices = layout[val[0].slice(1)].map(d => d.Province + '~' + d.District);
      } else {
        item.choices = val;
      }
    }).bind(this);

    rows.forEach(d => {
      let item;

      // indent == -1 for filter build
      if (indent >= 0 && d['Page-' + this.lang] != undefined && d['Page-' + this.lang].length) {
        let page = {
          title: d['Page-' + this.lang],
          "name": d['Page-' + this.lang],
          "elements": [],
        };
        pages.push(page);
        elements = page.elements;
      }

      if (d.Input == 'single' && type == "survey") {
        item = {
          type: "dropdown",
          name: d.Name,
          title: d["Description-" + this.lang],
          optionsCaption: "Select...", // otherwise gets from localization
          colCount: 0,
        }

        // if it needs parsing
        if (typeof(d["Values-" + this.lang]) == 'string')
          choicesByUrl(d, item);
      }

      if (d.Input == 'string' && type == "survey") {
        item = {
          type: "text",
          name: d.Name,
          title: d["Description-" + this.lang],
          pplaceHolder: "Type Here",
          colCount: 0,
        }

        if (d['Values-en']) item = {...item, ...JSON.parse(d['Values-en']) };
        if (d.Type == "email") item.inputType = "email";
        if (d.Type == "number") item.inputType = "number";
        if (parseInt(d.maxLen)) item.maxLength = parseInt(d.maxLen);

      }

      if (d.Type == 'date') {
        let def = new Date("01/01/1970");
        let now = new Date();
        var diff = now.getTime() - def.getTime();
        var daysDelta = parseInt(diff / (1000 * 60 * 60 * 24));

        item = {
          type: "text",
          inputType: "date",
          name: d.Name,
          title: d["Description-" + this.lang],
          defaultValueExpression: `today(-${daysDelta})`,
          colCount: 0,
          maxValueExpression: "today(-1)"
        }
      }

      if (d.Input == 'multiple' || (d.Input == "single" && type == "filter")) {
        item = {
          "type": "tagbox",
          name: d.Name,
          title: d["Description-" + this.lang],
        }
        choicesByUrl(d, item);
      }

      if (type == "survey") {
        if (item) {
          item.indent = indent;
          item.isRequired = d.Required;
          // item.maxWidth = "50vh";
          if (this.isIntake)
            item.visible = d.Intake || false;

          elements.push(item);
        }

        if (d.Input == 'array') {
          let newElements = this.addPanelDynamic(elements, d);
          let newRows = templates[d["Values-en"]];
          this.addItems(d["Values-" + this.lang], pages, newElements, templates, newRows, indent + 1);
        }
      }

      //   if (type == "filter") {
      //     if (item) elements.push(item);
      //     if (d.Input == 'array') {
      //       let newRows = templates[d["Values-en"]];
      //       this.addItems(d["Values-" + this.lang], pages, elements, templates, newRows, indent);
      //     }

      //     if (item && d.Input == "date") { // add extra date fields
      //       item.minWidth = "1vw";
      //       let range = {
      //         type: "dropdown",
      //         name: `${d.Name}-range`,
      //         title: "+/-",
      //         // optionsCaption: "+/-", // otherwise gets from localization
      //         colCount: 0,
      //         choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      //         minWidth: "1vw",
      //         startWithNewLine: false
      //       };
      //       let units = {
      //         type: "dropdown",
      //         name: `${d.Name}-units`,
      //         title: "Term",
      //         // optionsCaption: "time", // otherwise gets from localization
      //         colCount: 0,
      //         choices: ["days", "weeks", "months", "years"],
      //         minWidth: "1vw",
      //         // width: "10vw",
      //         startWithNewLine: false
      //       };
      //       elements.push(range, units);
      //     }
      //   }
    });
  }


  singlePrep(d) {
    let vals = d['Values-' + this.lang].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter).split(',').map(d => `"${d.trim()}"`);
    return JSON.parse(`[${vals.join(',')}]`)
  }

  multiPrep(d) {
    let vals = d['Values-' + this.lang].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter).split(',').map(d => `"${d.trim()}"`);
    return JSON.parse(`[${vals.join(',')}]`)
  }

  // Use survey framework as filter UI when we have enough data
  // filterUI() {
  //   let promise = new Promise((function(resolveFcn, rejectFcn) {
  //     let build = (function(dataObj) {
  //       var json = {
  //         questions: [],
  //         "focusFirstQuestionAutomatic": false,
  //         "showQuestionNumbers": "off"
  //       }

  //       this.addItems(json, json.questions, json.questions, dataObj.template, dataObj.template.Main, -1);
  //       resolveFcn(json);


  //       // DEPROCATED FOR LACK OF DATA


  //       // this.surveyObj = this.render("filters", json, { onComplete: setFilters });
  //       this.filterJSON = json;
  //     }).bind(this);

  //     let setFilters = (function(d) {
  //       console.log(d);
  //     }).bind(this);

  //     let searchParam = undefined;
  //     this.data.loadSurvey(searchParam, build);
  //   }.bind(this)));

  //   return promise;
  // }
}

export { SurveyUtil as default };