import SurveyData from "./surveyData.js"
import awsBackend from "../js/aws.js"

class SurveyUtil {
  constructor() {

    this.dataOp = { type: "put", key: undefined };
    this.data = new SurveyData();

    this.valPrep = {
      single: this.singlePrep,
      multiple: this.multiPrep
    }

    Survey
      .StylesManager
      .applyTheme("modern");

  }

  cb(d) {
    console.log(d);
  }

  chooser(dataObj) {
    let choices = dataObj.data.map(d => {
      let incident_pre = ""; //"Incident from ";
      let label = incident_pre + new Date(d.filed_timestamp).toLocaleString();
      return label;
    });

    let chooserJson = {
      "showQuestionNumbers": "off",
      "pages": [{
        "elements": [{
          "type": "dropdown",
          "name": "chooser",
          "title": "Select incident to edit or New",
          "optionsCaption": "New Incident",
          "choices": choices
        }]
      }]
    }

    let fillSurvey = (function(d, e) {
      console.log("Selected:", e.value || "New")
      let idx = choices.indexOf(e.value);
      if (idx == -1) {
        this.surveyObj.data = {};
        this.dataOp = { type: "put", key: undefined };
      } else {
        this.surveyObj.data = dataObj.data[idx];
        this.dataOp = { type: "update", key: dataObj.data[idx].filed_timestamp };
      }

      this.surveyObj.currentPage = 0 // return to start
    }).bind(this);

    let chooserEl = "chooserContainer";
    this.chooserObj = this.render(chooserEl, chooserJson, { onValueChanged: fillSurvey });
    d3.selectAll(`#${chooserEl} .sv-body .sv-footer`).remove(); // remove submit button
  }

  // Build Chooser & Survey
  init() {
    let build = (function(dataObj) {

      this.aws = new awsBackend({ submitSurvey: { POST: this.cb }, byDistrictOption: { POST: this.cb } }, false); // create - true
      this.aws.call('byDistrictOption');

      // this.chooser(dataObj);

      // SURVEY
      let json = {
        title: "Torture Incident Survey.",
        "completedHtml": "<h3>Thank you for your submission.</h3> <h5>We would be happy to send you more information, hear about a case referral, or get you involved!</h5><h6 style='cursor: pointer; transform:translateY(3rem);''>Click here to return home.</h6>",
        showProgressBar: "top",
        "pages": [],
        "showQuestionNumbers": "on"
      };

      let surveyOp = (function(sender) {
        console.log("Survey Op:", this.dataOp);
        if (this.dataOp.type == "put")
          this.data.addData(sender.data); // store

        if (this.dataOp.type == "update")
          this.data.modData(this.dataOp.key, sender.data);

        d3.select('#chooserContainer > *').remove();
        d3.select('#surveyContainer h6').on('click', (d => {
          console.log('re-init');
          this.init();
        }).bind(this));

        console.log("Pushed:", sender.data);

        this.aws.call('submitSurvey', { data: sender.data, lang: navigator.language.split('-')[0] }); // en, ur
      }).bind(this);

      this.addItems(json, json.pages, json.pages, dataObj.template, dataObj.template.Main)
      this.surveyObj = this.render("surveyContainer", json, { onComplete: surveyOp });
    }).bind(this);

    let searchParam = undefined;
    this.data.loadSurvey(searchParam, build);
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
      "name": d.name,
      "title": d.description,
      "renderMode": "list",
      "templateTitle": `${d.values} #{panelIndex}`,
      "templateElements": [],
      "panelCount": 1,
      "minPanelCount": 1,
      "panelAddText": `Add New ${d.values}`,
      "panelRemoveText": `Remove ${d.values}`,
    }
    if (parseInt(d.maxLen)) element.maxPanelCount = parseInt(d.maxLen);
    elements.push(element);
    return element.templateElements;
  }

  addItems(fn, pages, elements, templates, rows, indent) {
    let type = indent < 0 ? 'filter' : 'survey';

    if (!indent) indent = 0;

    let choicesByUrl = (function(d, item) {
      let val = this.valPrep[d.input](d);
      if (val[0].startsWith('*')) {
        item.choicesByUrl = {
          "url": `/jpp-prototype/data/Web Project Data Dictionary - ${val[0].slice(1)}.json`
        }
      } else {
        item.choices = val;
      }
    }).bind(this);

    rows.forEach(d => {
      let item;

      // indent == -1 for filter build
      if (indent >= 0 && d.page != undefined && d.page.length) {
        let page = {
          title: d.page,
          "name": d.page,
          "elements": [],
        };
        pages.push(page);
        elements = page.elements;
      }

      if (d.input == 'single' && type == "survey") {
        item = {
          type: "dropdown",
          name: d.name,
          title: d.description,
          optionsCaption: "Select...", // otherwise gets from localization
          colCount: 0,
          // choices: d.values
        }

        // if it needs parsing
        if (typeof(d.values) == 'string')
          choicesByUrl(d, item);
      }

      if (d.input == 'string' && type == "survey") {
        item = {
          type: "text",
          name: d.name,
          title: d.description,
          pplaceHolder: "Type Here",
          colCount: 0,
        }
        if (d.type == "email") item.inputType = "email";
        if (parseInt(d.maxLen)) item.maxLength = parseInt(d.maxLen);

      }

      if (d.input == 'date') {
        item = {
          type: "text",
          inputType: "date",
          name: d.name,
          title: d.description,
          pplaceHolder: "Type Here",
          colCount: 0,
          maxValueExpression: "today(-1)"
        }
      }

      // if (d.input == 'multiple') {
      //   item = {
      //     type: "checkbox",
      //     name: d.name,
      //     title: d.description,
      //     hasNone: true,
      //     colCount: 3,
      //     choices: this.valPrep[d.input](d)
      //   }
      // }

      if (d.input == 'multiple' || (d.input == "single" && type == "filter")) {
        item = {
          "type": "tagbox",
          name: d.name,
          title: d.description,
          // choices: this.valPrep[d.input](d)
          // "choicesByUrl": {
          //   "url": "../data/Web Project Data Dictionary - Constituencies.json"
          // }
        }
        choicesByUrl(d, item);
      }

      if (type == "survey") {
        if (item) {
          item.indent = indent;
          item.isRequired = d.required == "TRUE";
          // item.maxWidth = "50vh";
          // item.minWidth = "200px";
          elements.push(item);
        }
        if (d.input == 'array') {
          let newElements = this.addPanelDynamic(elements, d);
          let newRows = templates[d.values];
          this.addItems(d.values, pages, newElements, templates, newRows, indent + 1);
        }
      }

      if (type == "filter") {
        if (item) elements.push(item);
        if (d.input == 'array') {
          let newRows = templates[d.values];
          this.addItems(d.values, pages, elements, templates, newRows, indent);
        }

        if (item && d.input == "date") { // add extra date fields
          item.minWidth = "1vw";
          let range = {
            type: "dropdown",
            name: `${d.name}-range`,
            title: "+/-",
            // optionsCaption: "+/-", // otherwise gets from localization
            colCount: 0,
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            minWidth: "1vw",
            startWithNewLine: false
          };
          let units = {
            type: "dropdown",
            name: `${d.name}-units`,
            title: "Term",
            // optionsCaption: "time", // otherwise gets from localization
            colCount: 0,
            choices: ["days", "weeks", "months", "years"],
            minWidth: "1vw",
            // width: "10vw",
            startWithNewLine: false
          };
          elements.push(range, units);
        }
      }
    });
  }

  singlePrep(d) {
    let vals = d.values.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter).split(',').map(d => `"${d.trim()}"`);
    return JSON.parse(`[${vals.join(',')}]`)
  }

  multiPrep(d) {
    let vals = d.values.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter).split(',').map(d => `"${d.trim()}"`);
    return JSON.parse(`[${vals.join(',')}]`)
  }


  filterUI() {
    let promise = new Promise((function(resolveFcn, rejectFcn) {
      let build = (function(dataObj) {
        var json = {
          questions: [],
          "focusFirstQuestionAutomatic": false,
          "showQuestionNumbers": "off"
        }

        this.addItems(json, json.questions, json.questions, dataObj.template, dataObj.template.Main, -1);
        resolveFcn(json);



        // DEPROCATED FOR LACK OF DATA



        // this.surveyObj = this.render("filters", json, { onComplete: setFilters });
        this.filterJSON = json;
      }).bind(this);

      let setFilters = (function(d) {
        console.log(d);
      }).bind(this);

      let searchParam = undefined;
      this.data.loadSurvey(searchParam, build);
    }.bind(this)));

    return promise;
  }
}

export { SurveyUtil as default };