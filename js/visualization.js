// import { abuseData, extent, getRate, stateMean } from './tortureVisData.js';
import { cloudStore, frames, adm1Keys, adm2Keys } from './tortureVisData.js';
import SurveyUtil from "../js/survey.js"

class tortureVis {
  constructor(props) {
    this.cloudStore = new cloudStore();

    this.hasMouse = matchMedia('(pointer:fine)').matches;

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
    this.setTip(); // Defaults

    d3.select('#tortureVis #map #geo').on("click", (d => {
      if (this.map.data[0].geojson.includes("adm2")) {
        this.setGeo();
        this.build(); // reset scope to country
      }
      this.setTip();
    }).bind(this));

    this.cfgGeoMeta();
    this.build(props);

    let survey = new SurveyUtil();
    survey.filter();
  }

  cfgGeoMeta() {
    this.map = {};
    this.info = {};
    this.GID_1Keys = adm1Keys.map(d => d.GID_1);

    this.map.data = [{
      "type": "choropleth",
      "name": "PAK",
      // "geojson": "../data/PAK_adm1.json",
      // locations: this.GID_1Keys,
      // "z": this.cloudStore.getMapData(this.GID_1Keys),
      // featureidkey: "properties.GID_1",
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

  _updateProps(props) {
    this.props = {...this.props, ...props };
    return this.props;
  }

  build(props) {
    this._updateProps(props);

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

    let el = document.querySelector(this.props.container + ' #map #vis #geo');
    this.geo({...this.props, containerEl: el, width: el.clientWidth, height: el.clientHeight });
    el = document.querySelector(this.props.container + ' #meta #vis');
    this.meta({...this.props, containerEl: el, width: el.clientWidth, height: el.clientHeight });

    if (!this.hasMouse) {
      d3.select('#tortureVis #map #howto').text('Touch once for region details, twice for the province view. Swipe left for filters.')
        // d3.select('#map #vis #meta #howto').html('')
    }
  }

  setMapTitle(location) {
    let title = `Incident&nbsp;View:&nbsp;<span id="location">${location}</span>`;
    d3.select(this.props.container + ` #map #title`).html(title);
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

  setGeo(loc) {
    let root = this.map.data[0];
    let geojsonPath = "../data/PAK_admX.json";

    if ((root.geojson || "").includes("adm1")) {
      root.geojson = geojsonPath.replace("X", 2);
      root.featureidkey = "properties.GID_2";
      root.locations = adm2Keys.filter(d => d.GID_1 == loc).map(d => d.GID_2);
      root.z = this.cloudStore.getMapData(root.locations);
    } else {
      root.geojson = geojsonPath.replace("X", 1);
      root.featureidkey = "properties.GID_1";
      root.locations = this.GID_1Keys;
      root.z = this.cloudStore.getMapData(root.locations);
      // let ext = d3.extent(root.z);
      root.zmin = 0; //ext[0];
      root.zmax = d3.max(root.z); //ext[1];
      this.setTip();
    }

    this.setMapTitle(this.cloudStore.getMapName(root.locations));
  }

  setTip(key, value, color) {
    if (!key) { // Defaults
      key = "Pakistan"
      value = this.cloudStore.getMapData(['0']);
    }
    this.tip.setContent(`<div style="width:${this.tipWidth-(this.tipWidth*.1)}px;">${key}<hr>${value} Cases</div>`);
    // this.tip.show();
  }

  geo(props) {
    let el = props.containerEl;
    let cfg = { displayModeBar: false, responsive: true };
    let layout = {...this.map.layout, width: props.width, height: props.height };

    if (this.map.ran) {
      Plotly.react(el, this.map.data, this.map.layout, cfg);
    } else {
      this.setGeo();
      Plotly.newPlot(el, this.map.data, layout, cfg);

      el.on("plotly_hover", (function(data) {
        let key = data.points[0].location;
        let val = this.cloudStore.getMapData([key]);
        let name = this.cloudStore.regionIdToName(key);
        this.setTip(name, val);
      }).bind(this));

      el.on("plotly_click", (function(data) { // get loc and data
        if (this.hasMouse) { // plotly promotes hover to click on mobiles
          this.setGeo(data.points[0].location);
          this.geo(props); // rebuild
        } else {
          if (this.currentRegion == data.points[0].location) {
            this.setGeo(data.points[0].location);
            this.geo(props); // rebuild 
          }
          this.currentRegion = data.points[0].location;
        }
      }).bind(this));
    }
    this.map.ran = true;
  }

  meta(props) {
    let sel = props.containerEl; // document.querySelector(props.container);
    let root = this.info.data[0];

    let catRv = this.cloudStore.byCategorical('Region', this.map.data[0].locations);
    root.labels = catRv.pie.labels;
    root.values = catRv.pie.values;
    // root.layout.annotations[0].text = catRv.pie.total;

    var config = { displayModeBar: false, responsive: true }

    if (!this.metaVis) {
      this.metaVis = Plotly.newPlot(sel, this.info.data, this.info.layout, config);

      sel.on('plotly_hover', function(data) {
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

      sel.on('plotly_unhover', function(data) {
        console.log(data);
        d3.selectAll("#meta #vis svg .surface").attr('opacity', 1);

        this.geo.selectAll('path')
          .attr('fill', function() { return d3.select(this).attr("data-fill") })
          .attr('fill-opacity', 1)

        d3.selectAll('.legendCells .swatch')
          .style('fill', function() { return d3.select(this).attr("data-fill") });
      }.bind(this))

      document.querySelector(props.container + ' .modebar-container').remove();

    } else {
      Plotly.react(sel, this.info.data, this.info.layout, config);
    }
  }


  resize(props) {
    this.build(props);
  }
}

export { tortureVis as default };