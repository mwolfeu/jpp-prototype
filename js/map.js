import { mergeDeep, pGet, pSet } from "./util.js"

class Map {
  constructor(cfg) {
    let data = [{
      "type": "choropleth",
      // "name": "PAK",
      // "geojson": "/jpp-prototype/data/PAK_adm3.json",
      // locations: ["Abbottabad", "Bhittani"],
      // "z": [5, 10],
      // featureidkey: "properties.NAME_3",
      // text: "hi",
      // hovertext: "ho",
      // hovertemplate: "location",
      // hoverinfo: "location",
      "colorbar": {
        xanchor: "left",
        bgcolor: "rgba(255,255,255,.8)",
        thickness: 15,
        "y": .95,
        "yanchor": "top",
        "len": 0.45,
        "title": {
          "text": "Cases",
          "side": "right"
        }
      },
      hovertemplate: "<b>%{location}</b><br><span style='font-size:1.1em;'>Total: <b style='color:#e8545c'> %{z} </b></span> <extra></extra>",
      hoverlabel: { namelength: 50 },
      colorscale: 'Viridis',
      "reversescale": true,
    }];

    let layout = {
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
    };

    let config = { displayModeBar: false, responsive: true };

    let def = {
      selector: { root: "", vis: "#vis", info: "#info" },
      infoText: {}, // or {category:"text"} or {category:{en:"text"}}
      plotly: { layout, data, config, beforeRender: null }
    }

    // setup cfg and defaults
    this.cfg = mergeDeep(def, cfg || {});
    this.cfg.plotly.data[0] = mergeDeep(...this.cfg.plotly.data);
    this.cfg.plotly.data = [this.cfg.plotly.data[0]]; // only handle one

    this.react();
  }

  getCfg() {
    return this.cfg;
  }

  react() {
    let c = this.cfg;
    this.el = document.querySelector(c.selector.root + ' ' + c.selector.vis);

    if (c.plotly.beforeRender)
      c.plotly.beforeRender(c);

    if (this.vis) {
      Plotly.react(this.el, c.plotly.data, c.plotly.layout, c.plotly.config);
    } else {
      this.vis = Plotly.newPlot(this.el, c.plotly.data, c.plotly.layout, c.plotly.config);
    }
  }
}

export { Map }