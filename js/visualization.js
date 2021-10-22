// import { abuseData, extent, getRate, stateMean } from './tortureVisData.js';
import { cloudStore, frames, adm1Index, adm2Index } from './tortureVisData.js';
import SurveyUtil from "../js/survey.js"
import awsBackend from "../js/aws.js"

class tortureVis {
  constructor(props) {
    this.aws = new awsBackend({ byRegion: { POST: this.cb } });
    this.aws.call('byRegion');

    this.hasMouse = matchMedia('(pointer:fine)').matches;

    this.GID_1Keys = adm1Index.map(d => d.GID_1);

    this.curCategory = "Region";

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

    d3.select('#tortureVis #meta #filter-show').on("click", d => {
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
        let filters = d.questions.filter(d => d.type == "tagbox" && d.name != "constituency");
        let filterUICfg = d3.rollup(filters, d => d[0].choices, d => d.title); // map obj
        this.metaSelectInit(filterUICfg);
        this.cloudStore = new cloudStore(filterUICfg);
        return this.cloudStore.getIncidentData();
      }).bind(this)).then((function(d) {
        this.build();
      }).bind(this));

  }

  cb(d) {
    alert(d.message);
  }

  metaSelectInit(map) {
    let el = d3.select('#vis #metaSelect');
    let origMapColor = this.map.data[0].colorscale;

    map.forEach((v, k) =>
      el.append('option').text(k)
    )
    el.on('change',
      (d => {
        this.curCategory = d.srcElement.value;
        this.curOption = undefined;
        this.map.data[0].colorscale = origMapColor;
        d3.selectAll('g .slice').style('opacity', 1);
        d3.selectAll('.legendtext').style('font-weight', "unset");
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
      "geojson": "/jpp-prototype/data/PAK_adm1.json",
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
      hole: .2,
      type: 'pie',
      marker: {
        colors: ['#6388b4', '#ef6f6a', '#8cc2ca', '#55ad89', '#c3bc3f', '#bb7693', '#baa094', '#a9b5ae', '#767676', '#ffae34'],
      },
    }];

    this.info.layout = {
      xtitle: 'CASES OF ABUSE',
      // annotations: [{
      //   font: {
      //     size: 30 // 40 if landscape
      //   },
      //   showarrow: false,
      //   // text: tot,
      //   x: 0.5,
      //   y: 0.52
      // }, {
      //   font: {
      //     size: 12
      //   },
      //   showarrow: false,
      //   text: 'cases',
      //   x: 0.5,
      //   y: 0.43
      // }],
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
    // change category and locations before this.
    this.data = this.cloudStore.byCatOptReg(null, this.curCategory, this.curOption, this.curLocations);
    this.buildMeta();

    if (!this.hasMouse) {
      d3.select('#tortureVis #map #howto').text('Touch once for region details, twice for the province view. Swipe left for filters.')
    }
  }

  setMapTitle(location) {
    let title = `Incident&nbsp;View:&nbsp;<span id="location">${location}</span><span id="option">${this.curOption?"/"+this.curOption:""}</span>`;
    let el = this.getContainer("#map #title");
    d3.select(el).html(title);
  }

  setMapTitleOption(cat) {
    let el = this.getContainer("#map #title #option");
    d3.select(el).html(cat);
  }

  setTip(key, value, color) {
    this.tip.setContent(`<div style="width:${this.tipWidth-(this.tipWidth*.1)}px;">${key}<hr>${value} Cases</div>`);
  }

  buildGeo() {
    let el = this.getContainer("#geo");
    let root = this.map.data[0];

    let name = this.cloudStore.regionIdToName(this.mapScope);
    this.setMapTitle(name);
    this.setTip(name, this.data.total);
    this.setTip(name, d3.sum(this.data.map.values));

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

      let geojsonPath = "/jpp-prototype/data/PAK_admX.json";
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

          this.data = this.cloudStore.byCatOptReg(null, this.curCategory, this.curOption, this.curLocations);
          this.build();
        }).bind(this);

        if (this.hasMouse) { // plotly promotes hover to click on mobiles
          setScope();
        } else {
          if (currentRegion == data.points[0].location) {
            setScope();
          }
          currentRegion = data.points[0].location;
        }
      }).bind(this));

      // reset scope
      d3.select('#tortureVis #map #geo').on("click", (d => { // reset scope to country
        this.curLocations = this.GID_1Keys;
        root.geojson = geojsonPath.replace("X", 1);
        root.featureidkey = "properties.GID_1";

        this.mapScope = "0";
        this.data = this.cloudStore.byCatOptReg(null, this.curCategory, this.curOption, this.curLocations);
        this.build();
      }).bind(this));

    }
    this.map.ran = true;
  }

  buildMeta() {

    let el = this.getContainer("#meta"); // props.containerEl; // document.querySelector(props.container);
    let root = this.info.data[0];
    // let this.lastPieSliceClicked = null;

    root.labels = this.data.pie.labels;
    root.values = this.data.pie.values;
    // this.info.layout.annotations[0].text = this.data.total;

    var config = { displayModeBar: false, responsive: true }

    if (!this.metaVis) {
      this.metaVis = Plotly.newPlot(el, this.info.data, this.info.layout, config);
      let origColor = this.map.data[0].colorscale;

      el.on('plotly_click', (function(data) {
        let tipVal = -1;
        if (this.curCategory == "Region") return;

        if (this.lastPieSliceClicked != data.event.currentTarget) {
          // if (this.curCategory != "Region") {
          //   console.log("viewing category")
          // }

          let color = data.points[0].color;
          this.curOption = data.points[0].label;
          let rv = this.cloudStore.byCatOptReg(null, this.curCategory, this.curOption, this.curLocations);
          let optData = { values: rv.map.values, max: rv.max };

          d3.selectAll('g .slice').style('opacity', 1);
          d3.selectAll('.legendtext').style('font-weight', "unset");
          let siblings = d3.selectAll('g .slice').nodes().filter(d => d != data.event.currentTarget);
          d3.selectAll(siblings).transition().duration(200).style('opacity', .3)
          d3.select(`.legendtext[data-unformatted="${this.curOption}"]`).style('font-weight', 700);

          this.data.map.values = optData.values;
          this.data.max = optData.max; // max for all options
          this.map.data[0].colorscale = [
            [0, color],
            [1, 'rgb(255,255,255)'],
          ];
          this.buildGeo();
          console.log("Category: ", this.curCategory, color, this.curOption);
          this.lastPieSliceClicked = data.event.currentTarget;
        } else {
          // if (this.curCategory != "Region") {
          //   console.log("resetting to region")
          // }
          this.curOption = null;

          d3.selectAll('g .slice').style('opacity', 1);
          d3.selectAll('.legendtext').style('font-weight', "unset");

          this.map.data[0].colorscale = origColor;
          let rv = this.cloudStore.byCatOptReg(null, this.curCategory, this.curOption, this.curLocations);
          let optData = { values: rv.map.values, max: rv.max };
          this.data.map.values = optData.values;
          this.data.max = optData.max; // max for all options

          this.buildGeo();

          this.lastPieSliceClicked = null;
        }

      }.bind(this)));
    } else {
      Plotly.react(el, this.info.data, this.info.layout, config);
    }

    // reselect after .react()
    let selection = d3.selectAll('g .slice').nodes().filter(d => d.__data__.label == this.curOption);
    if (selection.length) {
      this.lastPieSliceClicked = null;
      d3.selectAll(selection).node().dispatchEvent(new Event("click"));
    }

    this.buildGeo();
  }


  resize(props) {
    this.build(props);
  }
}

export { tortureVis as default };