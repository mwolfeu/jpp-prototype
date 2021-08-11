class SurveyData {
  constructor() {
    // AWS Init
    this.lang = "en";
    this.dataPath = "../data/Web Project Data Dictionary - ";
    this.data = [ // AWS Promises?
      { filed_timestamp: 1626506562000, "first_name": "test0", "last_ame": "person", "gender": " Male", "occupation": "worker", "caste": " Jutt", "religion": "Muslim", "ethnicity": " Pashtun", "hosp_med": "True", "reason": ["Confession"], "rep_name": "personname", "complaint_filed": " False", "complaint_date": "2021-06-12", "mlc_conducted": "True", "outcome": "Compromise", "incidents": [{ "perpetrators": [{ "force": "Counter_terrorism_department (CTD)", "action": "Temporary Suspension", "rank": "Constable", "posting": "stationplace", "superior": "perpsuper" }], "date": "2021-01-05", "incident_type": "Torture", "place": "Police_lock_up", "torture_type": ["Physical"], "torture_methods": ["Beating", " Jack"] }] },
      { filed_timestamp: 1627507562000, "first_name": "test1", "last_ame": "person", "gender": " Male", "occupation": "worker", "caste": " Jutt", "religion": "Muslim", "ethnicity": " Pashtun", "hosp_med": "True", "reason": ["Confession"], "rep_name": "personname", "complaint_filed": " False", "complaint_date": "2021-07-12", "mlc_conducted": "True", "outcome": "Compromise", "incidents": [{ "perpetrators": [{ "force": "Counter_terrorism_department (CTD)", "action": "Temporary Suspension", "rank": "Constable", "posting": "stationplace", "superior": "perpsuper" }], "date": "2021-01-05", "incident_type": "Torture", "place": "Police_lock_up", "torture_type": ["Physical"], "torture_methods": ["Beating", " Jack"] }] },
      { filed_timestamp: 1628508562000, "first_name": "test2", "last_ame": "person", "gender": " Male", "occupation": "worker", "caste": " Jutt", "religion": "Muslim", "ethnicity": " Pashtun", "hosp_med": "True", "reason": ["Confession"], "rep_name": "personname", "complaint_filed": " False", "complaint_date": "2021-08-12", "mlc_conducted": "True", "outcome": "Compromise", "incidents": [{ "perpetrators": [{ "force": "Counter_terrorism_department (CTD)", "action": "Temporary Suspension", "rank": "Constable", "posting": "stationplace", "superior": "perpsuper" }], "date": "2021-01-05", "incident_type": "Torture", "place": "Police_lock_up", "torture_type": ["Physical"], "torture_methods": ["Beating", " Jack"] }] }
    ];

    // USER ID AND AUTH TOKENS (add,mod,del) PROVIDED BY COGNITO
  }

  // MAKE (add,mod,del) take uid
  // COGNITO can ignore if user not tagged as admin

  getData(timestamp) {
    let noSearch = !Boolean(timestamp);
    // search
    let obj = this.data.filter(d => noSearch || (d.filed_timestamp == timestamp));
    return obj;
  }

  addData(value) {
    // clean it, make sure only certain keys exist / only so big?
    // AWS submit new survey to get timestamp and re-pull dataObj
    value.filed_timestamp = new Date().getTime();
    value.user_token = 0; // AWS UID/auth
    this.data.push(value);
    // repull
    this.state.data = this.data;
  }

  modData(timestamp, value) {
    // search
    let obj = this.data.filter(d => d.filed_timestamp == timestamp);
    // update
    value.user_token = 0; // AWS UID/auth primary key
    value.filed_timestamp = timestamp; // Secondary key
    Object.keys(value).forEach(d => {
      obj[0][d] = value[d];
    })

    // repull
    this.state.data = this.data;
  }

  delData(timestamp) {
    // search / update
    this.data = this.data.filter(d => d.filed_timestamp != timestamp);
    // repull
    this.state.data = this.data;
  }

  getTemplate() {
    let promises = {};
    let files = [
      "Main",
      "Incident",
      "Perpetrator"
    ]

    files.forEach(d => {
      promises[d] = d3.csv(this.dataPath + d + ".csv", this.csvCleaner.bind(this))
        .then((function(d) {
          promises[this] = d;
        }).bind(d));
    });

    return promises;
  }

  loadSurvey(searchParam, cb) {
    this.state = { template: this.getTemplate(), data: this.getData(searchParam) };
    this.getResolve(this.state, cb);
  }

  async getResolve(p, cb) {
    let templatePromises = []
    Object.keys(p.template).forEach(d => {
      templatePromises.push(p.template[d])
    });

    await Promise.all(templatePromises); // force all the .then
    p.data = await Promise.all(p.data);
    cb(p);
  }

  loadSurveys(cb) {
    // get from db
    this.incidents = [
      { filed_timestamp: 1626506562000, "first_name": "test0", "last_ame": "person", "gender": " Male", "occupation": "worker", "caste": " Jutt", "religion": "Muslim", "ethnicity": " Pashtun", "hosp_med": "True", "reason": ["Confession"], "rep_name": "personname", "complaint_filed": " False", "complaint_date": "2021-06-12", "mlc_conducted": "True", "outcome": "Compromise", "incidents": [{ "perpetrators": [{ "force": "Counter_terrorism_department (CTD)", "action": "Temporary Suspension", "rank": "Constable", "posting": "stationplace", "superior": "perpsuper" }], "date": "2021-01-05", "incident_type": "Torture", "place": "Police_lock_up", "torture_type": ["Physical"], "torture_methods": ["Beating", " Jack"] }] },
      { filed_timestamp: 1627507562000, "first_name": "test1", "last_ame": "person", "gender": " Male", "occupation": "worker", "caste": " Jutt", "religion": "Muslim", "ethnicity": " Pashtun", "hosp_med": "True", "reason": ["Confession"], "rep_name": "personname", "complaint_filed": " False", "complaint_date": "2021-07-12", "mlc_conducted": "True", "outcome": "Compromise", "incidents": [{ "perpetrators": [{ "force": "Counter_terrorism_department (CTD)", "action": "Temporary Suspension", "rank": "Constable", "posting": "stationplace", "superior": "perpsuper" }], "date": "2021-01-05", "incident_type": "Torture", "place": "Police_lock_up", "torture_type": ["Physical"], "torture_methods": ["Beating", " Jack"] }] },
      { filed_timestamp: 1628508562000, "first_name": "test2", "last_ame": "person", "gender": " Male", "occupation": "worker", "caste": " Jutt", "religion": "Muslim", "ethnicity": " Pashtun", "hosp_med": "True", "reason": ["Confession"], "rep_name": "personname", "complaint_filed": " False", "complaint_date": "2021-08-12", "mlc_conducted": "True", "outcome": "Compromise", "incidents": [{ "perpetrators": [{ "force": "Counter_terrorism_department (CTD)", "action": "Temporary Suspension", "rank": "Constable", "posting": "stationplace", "superior": "perpsuper" }], "date": "2021-01-05", "incident_type": "Torture", "place": "Police_lock_up", "torture_type": ["Physical"], "torture_methods": ["Beating", " Jack"] }] }
    ];

    let incidents = this.incidents.map(d => "Incident from " + new Date(d.filed_timestamp).toLocaleString());

    cb([...incidents, "New incident"]);
  }

  csvCleaner(d) {
    return { page: d[`Page-${this.lang}`], name: d.Name, input: d.Input, description: d[`Description-${this.lang}`], values: d[`Values-${this.lang}`], required: d.Required }
  }

  loadQuestionTemplate(name, cb) {
    let promises = [];
    let files = [
      "Main.csv",
      "Incident.csv",
      "Perpetrator.csv"
    ]

    if (name == "surveyNew") {
      files.forEach(d => {
        promises.push(d3.csv(this.dataPath + d, this.csvCleaner.bind(this)));
      });
    }

    this.quiesce(files.map(d => d.split('.')[0]), promises, cb)
  }

  async quiesce(names, promises, cb) {
    let data = await Promise.all(promises);
    let rv = {};

    names.forEach((d, i) => rv[d] = data[i])

    cb(rv);
  }

}

export { SurveyData as default };