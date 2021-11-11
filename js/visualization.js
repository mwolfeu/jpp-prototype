import { frames, allFeatures } from './tortureVisData.js';
// import SurveyUtil from "./survey.js"
import awsBackend from "./aws.js"
import { pieSelect } from './pie.js'
import { Map } from './map.js'

class tortureVis {
  constructor(props) {
    this.aws = new awsBackend({
        byRegion: { POST: this.cbPie }
      },
      false);
    this.aws.call('byRegion');

    this.hasMouse = matchMedia('(pointer:fine)').matches;

    var d1 = document.querySelector(props.container);
    d1.insertAdjacentHTML('beforeend', frames);

  }

  cbPie(data) {
    let mapCfg = {
      selector: { root: '#tortureVis #map' },
      // plotly: { data: [{ featureidkey: "properties.NAME_3" }] }
      plotly: { data: [{ geojson: "/jpp-prototype/data/PAK_adm3_mod.json", zmin: 0 }] }
    };
    let map = new Map(mapCfg);

    // on change event
    document.addEventListener("pieselect-change", function(e) {
      console.log(e.detail, JSON.stringify(e.detail).length);

      let c = map.getCfg();

      let selRegions = pGet(e.detail, "selectState.region", "aVal");
      let filtered;
      if (selRegions.length) {
        let re = new RegExp(`^(${selRegions.join("|")})`, 'i');
        filtered = allFeatures.filter(d => re.test(d));
      }

      let locations = filtered ? filtered : allFeatures.filter(d => d != 'pakistan');
      let z = locations.map(d => e.detail.regions[d] || 0);

      c.plotly.data[0].locations = locations;
      c.plotly.data[0].z = z;
      c.plotly.data[0].zmax = z.reduce((a, b) => a > b ? a : b) || 10;

      let title = selRegions.length ? selRegions[0] : "Pakistan";
      let total = selRegions.length ? e.detail.filter.region[title] : e.detail.filter.total.value;

      document.querySelector('#tortureVis #map #title').innerHTML = `Torture in <span id="location">${title}</span>`;
      document.querySelector('#tortureVis #map #value').innerHTML = total;

      map.react();
    });

    let cfg = {
      data,
      selector: { root: '#tortureVis #meta' },
      startCategory: "region",
      eventFilter: d => d.pakistan,
      language: "en",
      infoText: {
        en: "Select the option to view.Deleselect all for an aggregate."
      },
      categories: {
        region: {
          options: undefined, // defined later
          values: undefined,
          excludeFromOptionCount: true,
          infoText: {
            en: "Select the province to view. Deselect all to view the country."
          }
        },
        gender: {
          // multiSelect: true
        }
      }
    };

    let provinces = [ // get from REST
      "Northern Areas",
      "Azad Kashmir",
      "Khyber Pakhtunkhawa",
      "Punjab",
      "Sindh",
      "Balochistan"
    ];

    cfg.categories.region.options = provinces;
    cfg.categories.region.values = provinces.map(d => data.pakistan.region[d]);
    let p = new pieSelect(cfg);
  }

}

export { tortureVis as default };