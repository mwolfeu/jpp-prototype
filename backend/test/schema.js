const Schema = require('../js/schema.js')

let schema = new Schema();

// let data = { pk: 123, status: 'reviewed', phone: '3217', first_name: 'm', last_name: 'w', born: '2016-02-06', gender: 'male', reason: ["information", "recovery"], incidents: [{ during: "arrest", torture_type: ["cultural_humiliation", "sexual_violence"], perpetrators: [{ rank: "constable", posting: "there" }] }] };
// console.log(schema.encode(data, 'en'), data)

data = [
  // { pk: 123, status: 'reviewed', phone: '3217', gender: 1, "incidents": [{ "date": "2021-11-01", "perpetrators": [{}] }], "last_name": "wolf", "first_name": "m", status: 'reviewed' },
  // { pk: 123, status: 'reviewed', phone: '3217', "occupation": "myjob", "rep_name": "this is a name", "incidents": [{ "date": "2021-11-01", "incident_type": 1, "torture_methods": [1, 5], "torture_type": [0, 2], "perpetrators": [{ "action": 0, "rank": "sdfg", "force": 0, "superior": "supervisor", "posting": "station police" }], "place": 2, "during": 1 }], "complaint_filed": 0, "reason": [1, 2], "gender": 0, "requestId": "1635951828322", "caste": "mycaste", "religion": 0, "mlc_conducted": 1, "complaint_date": "2021-11-01", "last_name": "lastname", "hosp_med": 1, "first_name": "me", "ethnicity": 5, "outcome": 0 },
  {
    // pk: 123,
    "status": "reviewed",
    "first_name": "asdf",
    "last_name": "asdf",
    "phone": "asdf",
    "born": "1970-01-01",
    "gender": "male",
    "complaint_date": "1970-01-01",
    "incidents": [{
      "date": "1970-01-01",
      "perpetrators": [
        {}
      ]
    }]
  }
]

data.forEach(d => { console.log(schema.encode(d, 'en')) })
console.log(data);

data.forEach(d => { console.log(schema.decode(d, 'en')) })
console.log(data);