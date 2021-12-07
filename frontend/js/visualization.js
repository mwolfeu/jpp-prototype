import { frames, allFeatures } from './tortureVisData.js';
import { pieSelect } from './pie.js'
import { Map } from './map.js'

class tortureVis {
  constructor(props) {

    var d1 = document.querySelector(props.container);
    d1.insertAdjacentHTML('beforeend', frames);

    if ("visData" in window) { // if predefined
      this.cbPie(window.visData);
    } else { // get it from AWS
      this.awsGet();
      // this.aws = new awsBackend({
      //     byRegion: { POST: this.cbPie }
      //   },
      //   false);
      // this.aws.call('byRegion');

      this.hasMouse = matchMedia('(pointer:fine)').matches;
    }
  }

  awsGet() {
    let url = "https://4z4ntfa3oi.execute-api.us-east-1.amazonaws.com/dev/v1/byRegion";
    let awsCfg = {
      method: 'POST'
    };

    const aws = new aws4fetch.AwsClient({
      accessKeyId: 'none',
      secretAccessKey: 'none',
    });
    console.log('Getting Aggregates');

    let call = (async function(url, opts) {
      const response = await aws.fetch(url, awsCfg);
      this.cbPie(await response.json());
      // return response;
    }).bind(this);

    call(url, awsCfg);
  }

  cbPie(data) {
    let mapCfg = {
      selector: { root: '#tortureVis #map' },
      // plotly: { data: [{ featureidkey: "properties.NAME_3" }] }
      plotly: { data: [{ geojson: "data/PAK_adm3_mod.json", zmin: 0 }] }
    };

    // add jpg download for admin mode
    if ('visData' in window) {
      mapCfg.plotly.config = { displayModeBar: true };
      // cfg.plotly = { config: { displayModeBar: true } };
    }

    let map = new Map(mapCfg);

    // on change event
    document.addEventListener("pieselect-change", function(e) {
      // console.log(e.detail, JSON.stringify(e.detail).length);

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
        },
        // other: {
        //   // multiSelect: true
        // }
      },
    };

    // add jpg download for admin mode
    if ('visData' in window) {
      mapCfg.plotly.config = { displayModeBar: true };
      cfg.plotly = { config: { displayModeBar: true } };
    }

    let provinces = pGet(data, "pakistan.region", "aKey");
    cfg.categories.region.options = provinces;
    cfg.categories.region.values = provinces.map(d => data.pakistan.region[d]);
    this.pie = new pieSelect(cfg);
  }

}

export { tortureVis as default };