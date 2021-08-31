// import { abuseData, extent, getRate, stateMean } from './tortureVisData.js';
import { cloudStore, frames, adm1Index, adm2Index } from './tortureVisData.js';
import SurveyUtil from "../js/survey.js"

class tortureVis {
  constructor(props) {

    this.hasMouse = matchMedia('(pointer:fine)').matches;

    this.GID_1Keys = adm1Index.map(d => d.GID_1);

    this.curCategory = "region";
    this.curLocations = this.GID_1Keys;

    var d1 = document.querySelector(props.container);
    d1.insertAdjacentHTML('beforeend', frames);

    // props.data.forEach(g => {
    //   // d3 has a non-spec winding issue.  Rewind it and we are good.
    //   // https://stackoverflow.com/questions/49311001/d3-js-drawing-geojson-incorrectly
    //   g.features = g.features.map(function(feature) {
    //     return turf.rewind(feature, { reverse: true });
    //   })
    //   g.allFeatures = g.features; // for filtering
    // });

    // this.allData = props.data;
    // props.data = props.data[0];
    // props.crNAME1 = 'Pakistan';

    d3.select('#tortureVis #map #geo #filter-show').on("click", d => {
      window.fullpage_api.moveSlideRight();
    });

    d3.select('#tortureVis #filter-hide').on("click", d => {
      window.fullpage_api.moveSlideLeft();
    });

    this.initGeoMeta();
    this.cfgTip();

    this.survey = new SurveyUtil();
    this.survey.filterUI()
      .then((function(d) { // init filter UI get cfg
        let filterUICfg = {}; // d; // {surveyFILTERS} 
        this.cloudStore = new cloudStore(filterUICfg);
        return this.cloudStore.getIncidentData();
      }).bind(this)).then((function(d) {
        // this.data = this.cloudStore.byCategorical(this.curCategory, this.GID_1Keys);
        // this.buildMeta();
        // this.setTip(); // Defaults
        this.build();
      }).bind(this));

  }

  cfgTip() {
    this.tipWidth = 200;
    const tipPad = 5;
    let clientRect = () => {
      let rect = d3.select('#tortureVis #map #geo ').node().getClientRects()[0];
      return ({
        width: this.tipWidth,
        height: 1,
        left: rect.left + rect.width - this.tipWidth - tipPad,
        top: rect.bottom - tipPad
      })
    }

    this.tippy = tippy('#tortureVis #map #geo', {
      placement: 'top',
      content: "content",
      allowHTML: true,
      arrow: false,
      hideOnClick: false,
      // showOnCreate: true,
      maxWidth: this.tipWidth,
      trigger: 'manual',
      getReferenceClientRect: clientRect,
    });

    this.tip = this.tippy[0];
  }

  getContainer(selector) {
    return document.querySelector("#tortureVis #main-container " + selector);
  }

  initGeoMeta() {
    this.mapScope = "0"; // Pakistan
    this.map = {};
    this.info = {};

    this.map.data = [{
      "type": "choropleth",
      "name": "PAK",
      "geojson": "../data/PAK_adm1.json",
      // locations: this.GID_1Keys,
      // "z": this.cloudStore.getMapData(this.GID_1Keys),
      featureidkey: "properties.GID_1",
      // text: "hi",
      // hovertext: "ho",
      // hovertemplate: "%{location} %{z} %{text}",
      // hoverinfo: "location+z",
      "colorbar": {
        xanchor: "left",
        bgcolor: "rgba(255,255,255,.8)",
        thickness: 15,
        // "x": 1,
        "y": .95,
        // xanchor: "left",
        "yanchor": "top",
        "len": 0.45,
        "title": {
          "text": "Cases",
          "side": "right"
        }
      },
      colorscale: 'Viridis',
      "reversescale": true,
    }];

    this.map.layout = {
      "geo": {
        "projection": {
          "type": "mercator"
        },
        bgcolor: 'rgba(0,0,0,0)',
        fitbounds: "locations",
        showframe: false,
        showcountries: false,
        showcoastlines: false,
      },
      // bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: "rgba(0,0,0,0)",
      // "width": props.width,
      // "height": props.height,
      "margin": { "t": 10, "b": 10, "l": 10 },
      dragmode: false,
    }

    this.info.data = [{
      // values: [16, 15, 12, 6, 5, 4],
      // labels: ["Muslim", "Hindu", "Christian", "Ahmadiyya", "Sikh", "Other"],
      domain: { column: 0 },
      name: 'NAME',
      hoverinfo: '', //'label+percent+name',
      hole: .4,
      type: 'pie',
      marker: {
        colors: ['#6388b4', '#ef6f6a', '#8cc2ca', '#55ad89', '#c3bc3f', '#bb7693', '#baa094', '#a9b5ae', '#767676', '#ffae34'],
      },
    }];

    this.info.layout = {
      xtitle: 'CASES OF ABUSE',
      annotations: [{
        font: {
          size: 30 // 40 if landscape
        },
        showarrow: false,
        // text: tot,
        x: 0.5,
        y: 0.52
      }, {
        font: {
          size: 12
        },
        showarrow: false,
        text: 'cases',
        x: 0.5,
        y: 0.43
      }],
      // height: props.height,
      // width: props.width,
      showlegend: true,
      grid: { rows: 1, columns: 1 }
    };
  }

  // _updateProps(props) {
  //   this.props = {...this.props, ...props };
  //   return this.props;
  // }

  build() {
    // this._updateProps(props);

    // // let isResize = "width" in props && "height" in props && Object.keys(props).length == 2;
    // let initFcns = [
    //   // { fcn: 'initMapTitle', sel: '#map #title' },
    //   { fcn: 'geo', sel: '#map #vis #geo' },
    //   // { fcn: 'initInMap', sel: '#map #vis #filter-legend' },
    //   // { fcn: 'initRHS', sel: '#meta #vis' }
    // ];

    // initFcns.forEach(d => {
    //   let el = document.querySelector(this.props.container + ` ${d.sel}`);
    //   this[d.fcn]({...this.props, containerEl: el, width: el.clientWidth, height: el.clientHeight })
    // });

    // this.addTextBuffers();

    // let el = document.querySelector(this.props.container + ' #map #vis #geo');
    // this.geo({...this.props, containerEl: el, width: el.clientWidth, height: el.clientHeight });
    // el = document.querySelector(this.props.container + ' #meta #vis');
    // this.meta({...this.props, containerEl: el, width: el.clientWidth, height: el.clientHeight });
    // this.buildMeta

    // change category and locations before this.
    this.data = this.cloudStore.byCategorical(this.curCategory, this.curLocations);
    this.buildMeta();

    let name = this.cloudStore.regionIdToName(this.mapScope);
    this.setMapTitle(name);
    this.setTip(name, this.data.total);

    if (!this.hasMouse) {
      d3.select('#tortureVis #map #howto').text('Touch once for region details, twice for the province view. Swipe left for filters.')
        // d3.select('#map #vis #meta #howto').html('')
    }
  }

  setMapTitle(location) {
    let title = `Incident&nbsp;View:&nbsp;<span id="location">${location}</span>`;
    let el = this.getContainer("#map title");
    d3.select(el).html(title);
  }

  // initInMap(props) {}

  // changeRegion(el, props) {
  //   let data, name;

  //   if (el) {
  //     name = d3.select(el).attr("data-name1");
  //     data = this.allData[1];
  //     data.features = data.allFeatures.filter(d => d.properties.NAME_1 == name);
  //   } else {
  //     data = this.allData[0];
  //     data.features = data.allFeatures;
  //   }

  //   let crNAME1 = name ? name : 'Pakistan';

  //   this.build({...props, data, crNAME1 });
  //   // this.initInMap(props, d3.select(el).attr("data-gid2"), name)
  // }

  // ssetGeoProps(loc) {
  //   let root = this.map.data[0];
  //   // let geojsonPath = "../data/PAK_admX.json";

  //   if (loc == "l2") {
  //     root.geojson = geojsonPath.replace("X", 2);
  //     root.featureidkey = "properties.GID_2";
  //     // root.locations = this.data.map.labels;
  //     // root.locations = adm2Keys.filter(d => d.GID_1 == loc).map(d => d.GID_2);
  //     // root.z = this.cloudStore.getMapData(root.locations);
  //   }

  //   if (loc == "l1") {
  //     root.geojson = geojsonPath.replace("X", 1);
  //     root.featureidkey = "properties.GID_1";
  //     // root.locations = this.GID_1Keys;
  //     // root.z = this.cloudStore.getMapData(root.locations);
  //     // let ext = d3.extent(root.z);
  //     //ext[0];
  //     // root.zmax = d3.max(root.z); //ext[1];

  //   }

  //   root.locations = this.data.map.labels;
  //   root.z = this.data.map.values;
  //   root.zmin = 0;
  //   root.zmax = this.data.max;
  // }

  // resetMapClick() {
  //   let name = this.cloudStore.regionIdToName("0");
  //   this.setMapTitle(name);
  //   this.setTip(name, this.data.total);
  // }

  setTip(key, value, color) {
    // if (!key) { // Defaults
    //   key = "Pakistan"
    //   value = this.cloudStore.getMapData(['0']);
    // }
    this.tip.setContent(`<div style="width:${this.tipWidth-(this.tipWidth*.1)}px;">${key}<hr>${value} Cases</div>`);
    // this.tip.show();
  }

  buildGeo() {
    let el = this.getContainer("#geo");


    let root = this.map.data[0];
    // let geojsonPath = "../data/PAK_admX.json";

    // if (loc == "l2") {
    //   root.geojson = geojsonPath.replace("X", 2);
    //   root.featureidkey = "properties.GID_2";
    //   // root.locations = this.data.map.labels;
    //   // root.locations = adm2Keys.filter(d => d.GID_1 == loc).map(d => d.GID_2);
    //   // root.z = this.cloudStore.getMapData(root.locations);
    // }

    // if (loc == "l1") {
    //   root.geojson = geojsonPath.replace("X", 1);
    //   root.featureidkey = "properties.GID_1";
    //   // root.locations = this.GID_1Keys;
    //   // root.z = this.cloudStore.getMapData(root.locations);
    //   // let ext = d3.extent(root.z);
    //   //ext[0];
    //   // root.zmax = d3.max(root.z); //ext[1];

    // }

    root.locations = this.data.map.labels;
    root.z = this.data.map.values;
    root.zmin = 0;
    root.zmax = this.data.max;

    let cfg = { displayModeBar: false, responsive: true };
    let layout = {...this.map.layout }; //, width: props.width, height: props.height };

    if (this.map.ran) {
      Plotly.react(el, this.map.data, this.map.layout, cfg);
    } else {
      Plotly.newPlot(el, this.map.data, layout, cfg);

      // update tip
      el.on("plotly_hover", (function(data) {
        let key = data.points[0].location;
        let idx = this.map.data[0].locations.indexOf(key);
        let val = this.map.data[0].z[idx];

        let name = this.cloudStore.regionIdToName(key);
        this.setTip(name, val);
      }).bind(this));

      let geojsonPath = "../data/PAK_admX.json";
      let currentRegion;

      // change view level
      el.on("plotly_click", (function(data) { // get loc and data

        let setScope = (function() {
          if (this.curLocations === this.GID_1Keys) {
            let location = data.points[0].location.slice(0, 5) + '_1'; // Plotly BUG: lvl2 locations w lvl1 geojson EG: PAK.7.5_1 should be PAK.7_1
            this.curLocations = this.cloudStore.regionLvl1ToLvl2(location);
            root.geojson = geojsonPath.replace("X", 2);
            root.featureidkey = "properties.GID_2";
            this.mapScope = location;
          } else {
            this.curLocations = this.GID_1Keys;
            root.geojson = geojsonPath.replace("X", 1);
            root.featureidkey = "properties.GID_1";
            this.mapScope = "0";
          }

          this.data = this.cloudStore.byCategorical(this.curCategory, this.curLocations);
          this.build();
        }).bind(this);

        if (this.hasMouse) { // plotly promotes hover to click on mobiles
          setScope();
        } else {
          if (currentRegion == data.points[0].location) { // make not this
            setScope();
          }
          currentRegion = data.points[0].location;
        }
      }).bind(this));

      // reset scope
      d3.select('#tortureVis #map #geo').on("click", (d => { // reset scope to country
        // if (this.map.data[0].geojson.includes("adm2")) {
        this.curLocations = this.GID_1Keys;
        root.geojson = geojsonPath.replace("X", 1);
        root.featureidkey = "properties.GID_1";

        this.mapScope = "0";
        this.data = this.cloudStore.byCategorical(this.curCategory, this.curLocations);
        this.build();
        // }
      }).bind(this));

    }
    this.map.ran = true;
  }

  buildMeta() {

    let el = this.getContainer("#meta"); // props.containerEl; // document.querySelector(props.container);
    let root = this.info.data[0];

    root.labels = this.data.pie.labels;
    root.values = this.data.pie.values;
    this.info.layout.annotations[0].text = this.data.total;

    var config = { displayModeBar: false, responsive: true }

    if (!this.metaVis) {
      this.metaVis = Plotly.newPlot(el, this.info.data, this.info.layout, config);

      el.on('plotly_hover', function(data) {
        console.log(data);
        d3.selectAll("#meta #vis svg .surface").attr('opacity', .4);

        let curFill = d3.select(data.event.currentTarget).select('path')
          .attr('opacity', 1)
          .style('fill');

        this.geo.selectAll('path')
          .attr('data-fill', function() { return d3.select(this).attr("fill") })
          .attr('fill', curFill)
          .attr('fill-opacity', d => Math.random())

        let swatches = d3.selectAll('.legendCells .swatch')
        let swatchNum = swatches.nodes().length;
        let color = d3.interpolateRgb('rgb(255,255,255)', curFill);

        swatches
          .attr('data-fill', function() {
            return d3.select(this).style('fill')
          })
          .style('fill', (d, i) => color(i / swatchNum));

      }.bind(this))

      el.on('plotly_unhover', function(data) {
        console.log(data);
        d3.selectAll("#meta #vis svg .surface").attr('opacity', 1);

        this.geo.selectAll('path')
          .attr('fill', function() { return d3.select(this).attr("data-fill") })
          .attr('fill-opacity', 1)

        d3.selectAll('.legendCells .swatch')
          .style('fill', function() { return d3.select(this).attr("data-fill") });
      }.bind(this))
    } else {
      Plotly.react(el, this.info.data, this.info.layout, config);
    }

    this.buildGeo();
    // this.setGeoProps('l1');
  }


  resize(props) {
    this.build(props);
  }
}

export { tortureVis as default };