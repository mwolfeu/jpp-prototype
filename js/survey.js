import SurveyData from "./surveyData.js"

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
      console.log(e.value || "New Survey")
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

  init() {
    let build = (function(dataObj) {
      this.chooser(dataObj);

      // SURVEY
      let json = {
        title: "Torture Incident Survey.",
        "completedHtml": "<h3>Thank you for your submission.</h3> <h5>We would be happy to send you more information, hear about a case referral, or get you involved!</h5><h6 style='cursor: pointer; transform:translateY(3rem);''>Click here to return.</h6>",
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
      minPanelCount: 1,
      "title": d.description,
      "renderMode": "list",
      "templateTitle": `${d.values} #{panelIndex}`,
      "templateElements": [],
      "panelCount": 1,
      "panelAddText": `Add New ${d.values}`,
      "panelRemoveText": `Remove ${d.values}`
    }
    elements.push(element);
    return element.templateElements;
  }

  addItems(fn, pages, elements, templates, rows, indent) {
    if (!indent) indent = 0;

    rows.forEach(d => {
      let item;

      if (d.page != undefined && d.page.length) {
        let page = {
          title: d.page,
          "name": d.page,
          "elements": []
        };
        pages.push(page);
        elements = page.elements;
      }

      if (d.input == 'single' && d.name != 'constituency') {
        item = {
          type: "dropdown",
          name: d.name,
          title: d.description,
          optionsCaption: "Select...", // otherwise gets from localization
          colCount: 0,
          choices: d.values
        }

        // if it needs parsing
        if (typeof(d.values) == 'string')
          item.choices = this.valPrep[d.input](d);

      }

      if (d.input == 'string') {
        item = {
          type: "text",
          name: d.name,
          title: d.description,
          pplaceHolder: "Type Here",
          colCount: 0,
        }

      }

      if (d.input == 'date') {
        item = {
          type: "text",
          inputType: "date",
          name: d.name,
          title: d.description,
          pplaceHolder: "Type Here",
          colCount: 0,
        }

      }

      if (d.input == 'multiple') {
        item = {
          type: "checkbox",
          name: d.name,
          title: d.description,
          hasNone: true,
          colCount: 3,
          choices: this.valPrep[d.input](d)
        }
      }

      if (item) {
        item.indent = indent;
        item.isRequired = d.required == "TRUE",
          //item.maxWidth = "800px";
          elements.push(item);
      }
      if (d.input == 'array') {
        let newElements = this.addPanelDynamic(elements, d);
        let newRows = templates[d.values];
        this.addItems(d.values, pages, newElements, templates, newRows, indent + 1);
      }
    });
  }

  singlePrep(d) {
    let vals = d.values.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).split(',').map(d => `"${d}"`);
    return JSON.parse(`[${vals.join(',')}]`)
  }

  multiPrep(d) {
    let vals = d.values.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).split(',').map(d => `"${d}"`);
    return JSON.parse(`[${vals.join(',')}]`)
  }

}

export { SurveyUtil as default };