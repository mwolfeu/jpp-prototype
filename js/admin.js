import SurveyUtil from "./survey.js"


let survey = new SurveyUtil();
survey.init();

// let survey.filterUI()
//   .then((function(d) { // init filter UI get cfg
//     // DEPROCATED FILTER - TOO LITTLE DATA
//     // REWRITE
//     let filters = d.questions.filter(d => d.type == "tagbox" && d.name != "region");
//     let filterUICfg = d3.rollup(filters, d => d[0].choices, d => d.title); // map obj
//     // this.metaSelectInit(filterUICfg);
//     this.cloudStore = new cloudStore(filterUICfg);
//     return this.cloudStore.getIncidentData();
//   }).bind(this)).then((function(d) {
//     this.build();
//   }).bind(this));