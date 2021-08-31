// this.allData[0].features.map(d => {return{GID_1:d.properties.GID_1, name:d.properties.NAME_1}})
let adm1Index = [{
    "GID_1": "PAK.1_1",
    "name": "Azad Kashmir"
  },
  {
    "GID_1": "PAK.2_1",
    "name": "Baluchistan"
  },
  {
    "GID_1": "PAK.3_1",
    "name": "F.A.T.A."
  },
  {
    "GID_1": "PAK.4_1",
    "name": "F.C.T."
  },
  {
    "GID_1": "PAK.5_1",
    "name": "N.W.F.P."
  },
  {
    "GID_1": "PAK.6_1",
    "name": "Northern Areas"
  },
  {
    "GID_1": "PAK.7_1",
    "name": "Punjab"
  },
  {
    "GID_1": "PAK.8_1",
    "name": "Sind"
  }
];

// this.props.data[1].features.map(d => ({GID_1:d.properties.GID_1, GID_2:d.properties.GID_2, name:d.properties.NAME_2}))
let adm2Index = [{
    "GID_1": "PAK.1_1",
    "GID_2": "PAK.1.1_1",
    "name": "Azad Kashmir"
  },
  {
    "GID_1": "PAK.2_1",
    "GID_2": "PAK.2.1_1",
    "name": "Kalat"
  },
  {
    "GID_1": "PAK.2_1",
    "GID_2": "PAK.2.2_1",
    "name": "Makran"
  },
  {
    "GID_1": "PAK.2_1",
    "GID_2": "PAK.2.3_1",
    "name": "Nasirabad"
  },
  {
    "GID_1": "PAK.2_1",
    "GID_2": "PAK.2.4_1",
    "name": "Quetta"
  },
  {
    "GID_1": "PAK.2_1",
    "GID_2": "PAK.2.5_1",
    "name": "Sibi"
  },
  {
    "GID_1": "PAK.2_1",
    "GID_2": "PAK.2.6_1",
    "name": "Zhob"
  },
  {
    "GID_1": "PAK.3_1",
    "GID_2": "PAK.3.1_1",
    "name": "F.A.T.A."
  },
  {
    "GID_1": "PAK.4_1",
    "GID_2": "PAK.4.1_1",
    "name": "Islamabad"
  },
  {
    "GID_1": "PAK.5_1",
    "GID_2": "PAK.5.1_1",
    "name": "Bannu"
  },
  {
    "GID_1": "PAK.5_1",
    "GID_2": "PAK.5.2_1",
    "name": "Dera Ismail Khan"
  },
  {
    "GID_1": "PAK.5_1",
    "GID_2": "PAK.5.3_1",
    "name": "F.A.T.A."
  },
  {
    "GID_1": "PAK.5_1",
    "GID_2": "PAK.5.4_1",
    "name": "Hazara"
  },
  {
    "GID_1": "PAK.5_1",
    "GID_2": "PAK.5.5_1",
    "name": "Kohat"
  },
  {
    "GID_1": "PAK.5_1",
    "GID_2": "PAK.5.6_1",
    "name": "Malakand"
  },
  {
    "GID_1": "PAK.5_1",
    "GID_2": "PAK.5.7_1",
    "name": "Mardan"
  },
  {
    "GID_1": "PAK.5_1",
    "GID_2": "PAK.5.8_1",
    "name": "Peshawar"
  },
  {
    "GID_1": "PAK.6_1",
    "GID_2": "PAK.6.1_1",
    "name": "Northern Areas"
  },
  {
    "GID_1": "PAK.7_1",
    "GID_2": "PAK.7.1_1",
    "name": "Bahawalpur"
  },
  {
    "GID_1": "PAK.7_1",
    "GID_2": "PAK.7.2_1",
    "name": "Dera Ghazi Khan"
  },
  {
    "GID_1": "PAK.7_1",
    "GID_2": "PAK.7.3_1",
    "name": "Faisalabad"
  },
  {
    "GID_1": "PAK.7_1",
    "GID_2": "PAK.7.4_1",
    "name": "Gujranwala"
  },
  {
    "GID_1": "PAK.7_1",
    "GID_2": "PAK.7.5_1",
    "name": "Lahore"
  },
  {
    "GID_1": "PAK.7_1",
    "GID_2": "PAK.7.6_1",
    "name": "Multan"
  },
  {
    "GID_1": "PAK.7_1",
    "GID_2": "PAK.7.7_1",
    "name": "Rawalpindi"
  },
  {
    "GID_1": "PAK.7_1",
    "GID_2": "PAK.7.8_1",
    "name": "Sargodha"
  },
  {
    "GID_1": "PAK.8_1",
    "GID_2": "PAK.8.1_1",
    "name": "Hyderabad"
  },
  {
    "GID_1": "PAK.8_1",
    "GID_2": "PAK.8.2_1",
    "name": "Karachi"
  },
  {
    "GID_1": "PAK.8_1",
    "GID_2": "PAK.8.3_1",
    "name": "Larkana"
  },
  {
    "GID_1": "PAK.8_1",
    "GID_2": "PAK.8.4_1",
    "name": "Mirpur Khas"
  },
  {
    "GID_1": "PAK.8_1",
    "GID_2": "PAK.8.5_1",
    "name": "Rann of Kutch"
  },
  {
    "GID_1": "PAK.8_1",
    "GID_2": "PAK.8.6_1",
    "name": "Sukkur"
  }
];

let frames = `
<div id="main-container">
    <div id="map-meta-container">
        <div id="map">
            <div id="title"></div>
            <div id="vis">
                <div id="geo">
                  <span id="filter-show" class="material-icons-outlined">filter_alt</span>
                  <div id="filter-legend"></div>
                </div>
            </div>
            <div id="howto">
                Select a state or filter for more specific results.
            </div>
        </div>
        <div id="meta">
            <div id="title"></div>
            <div id="vis">
              <span id="filter">
                <span class="meta-select">
                  <multiselect v-model="mftValue" v-on:input="eventMFT" :close-on-select="true" :options="metaFilterTypes" :preselect-first="true" :multiple="false" :close-on-select="false" :show-labels="false"></multiselect>
                </span>
                <span class="meta-select">
                  <multiselect v-model="mfcValue" v-on:input="eventMFC" :close-on-select="true" :options="metaFilterCategories" :preselect-first="true" :multiple="false" :searchable="true" :close-on-select="false" :show-labels="false"></multiselect>
                </span>
              </span>
            </div>
            <div id="howto">
                Select a subgroup or view specific case.
            </div>
        </div> 
    </div> 
</div>
`
  // let getRate = function(g2) {
  //   return abuseData.filter(d => d.g2 == g2)[0].incidents.length;
  // }

class cloudStore {
  constructor(filterOpts) {
    this.filterOpts = filterOpts;

    // this.incidentData = { '0': 0 };
    this.admNames = { 0: 'Pakistan' };
    adm2Index.forEach(d => {
      this.admNames[d.GID_2] = d.name;
      // this.incidentData[d.GID_2] = parseInt(Math.random() * 200)
    });
    adm1Index.forEach(d => { // sum adm2Keys val
      this.admNames[d.GID_1] = d.name;
      // let f = adm2Keys
      //   .filter(e => e.GID_1 == d.GID_1)
      //   .map(d => d.GID_2);
      // let sum = d3.sum(f, g => this.incidentData[g]);
      // this.incidentData[d.GID_1] = sum;
      // this.incidentData['0'] += sum;
    });
  }

  getMapData(targets) { // get region count
    return targets.map(d => this.incidentData[d]);
  }

  getMapName(targets) {
    let tSet = [...new Set(targets.map(d => d.slice(0, 5)))]; // how many diff prefixes
    if (tSet.length == 1)
      return adm1Keys.filter(d => d.GID_1.startsWith(tSet[0]))[0].name;
    else
      return "Pakistan";
  }

  regionLvl1ToLvl2(id) {
    return adm2Index.filter(d => d.GID_1 == id).map(d => d.GID_2);
  }

  regionIdToName(target) { // TODO combine w above
    if (Array.isArray(target))
      return target.map(d => this.admNames[d]);
    else
      return this.admNames[target];
  }

  genStats() { // on this.filtered
    let categories = { region: ["all"], ...this.filterOpts };
    this.stats = {};

    // category stats
    Object.keys(categories).forEach(d => { // per category
      this.stats[d] = {};
      categories[d].forEach(e => { // per opt
        this.stats[d][e] = {};
        Object.keys(this.admNames).forEach(f => { // for all map regions
          this.stats[d][e][f] = parseInt(Math.random() * 30); // call stat fcn
        });
      });
    });
  }

  getIncidentData(filterSpec) {
    let promise = new Promise((function(resolveFcn, rejectFcn) {
      console.log('filtering:', filterSpec);
      this.raw = this.incidentData; // will be AWS objs
      this.filtered = this.raw;
      this.genStats();
      resolveFcn(this.incidentData);
    }.bind(this)));

    return promise;
  }

  byCategorical(category, regions) { // return cases category

    let options = Object.keys(this.stats[category]);
    let optVals = options.map(o => { // by option
      return d3.sum(regions, r => this.stats[category][o][r]);
    });

    let regVals = regions.map(r => { // by region
      return d3.sum(options, o => this.stats[category][o][r]);
    });

    let rv = {
      pie: { labels: options, values: optVals },
      map: { labels: regions, values: regVals }
    };

    if (category = "region") { // special case
      rv.pie.labels = this.regionIdToName(rv.map.labels);
      rv.pie.values = rv.map.values;
    }
    // stats
    rv.total = d3.sum(rv.map.values);
    rv.max = d3.max(rv.map.values);

    return rv;
  }
}

// let states = [
//   "Azad Kashmir",
//   "Baluchistan",
//   "F.A.T.A.",
//   "F.C.T.",
//   "N.W.F.P.",
//   "Northern Areas",
//   "Punjab",
//   "Sind"
// ];

// let extent = [0, 20].reverse();

// // data.allFeatures.map(d => {return {n1:d.properties.NAME_1, g2:d.properties.GID_2, incidents:Array(parseInt(Math.random()*20)).fill({})}})
// let abuseData = [{
//     "n1": "Azad Kashmir",
//     "g2": "PAK.1.1_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Baluchistan",
//     "g2": "PAK.2.1_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Baluchistan",
//     "g2": "PAK.2.2_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Baluchistan",
//     "g2": "PAK.2.3_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Baluchistan",
//     "g2": "PAK.2.4_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Baluchistan",
//     "g2": "PAK.2.5_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Baluchistan",
//     "g2": "PAK.2.6_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "F.A.T.A.",
//     "g2": "PAK.3.1_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "F.C.T.",
//     "g2": "PAK.4.1_1",
//     "incidents": []
//   },
//   {
//     "n1": "N.W.F.P.",
//     "g2": "PAK.5.1_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "N.W.F.P.",
//     "g2": "PAK.5.2_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "N.W.F.P.",
//     "g2": "PAK.5.3_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "N.W.F.P.",
//     "g2": "PAK.5.4_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "N.W.F.P.",
//     "g2": "PAK.5.5_1",
//     "incidents": [
//       {}
//     ]
//   },
//   {
//     "n1": "N.W.F.P.",
//     "g2": "PAK.5.6_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "N.W.F.P.",
//     "g2": "PAK.5.7_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "N.W.F.P.",
//     "g2": "PAK.5.8_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Northern Areas",
//     "g2": "PAK.6.1_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Punjab",
//     "g2": "PAK.7.1_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Punjab",
//     "g2": "PAK.7.2_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Punjab",
//     "g2": "PAK.7.3_1",
//     "incidents": []
//   },
//   {
//     "n1": "Punjab",
//     "g2": "PAK.7.4_1",
//     "incidents": [
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Punjab",
//     "g2": "PAK.7.5_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Punjab",
//     "g2": "PAK.7.6_1",
//     "incidents": [
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Punjab",
//     "g2": "PAK.7.7_1",
//     "incidents": []
//   },
//   {
//     "n1": "Punjab",
//     "g2": "PAK.7.8_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Sind",
//     "g2": "PAK.8.1_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Sind",
//     "g2": "PAK.8.2_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Sind",
//     "g2": "PAK.8.3_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Sind",
//     "g2": "PAK.8.4_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Sind",
//     "g2": "PAK.8.5_1",
//     "incidents": [
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {},
//       {}
//     ]
//   },
//   {
//     "n1": "Sind",
//     "g2": "PAK.8.6_1",
//     "incidents": []
//   }
// ];

// let stateMean = {};

// states.forEach(n1 => {
//   let gid2s = abuseData.filter(ad => ad.n1 == n1);
//   stateMean[n1] = d3.mean(gid2s.map(d => getRate(d.g2)));
// });

export { cloudStore, frames, adm1Index, adm2Index }