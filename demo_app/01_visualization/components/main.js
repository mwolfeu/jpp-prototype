import {
    scaleLinear,
    scaleLog,
    scaleOrdinal,
    scaleSqrt,
} from 'd3-scale';
import * as d3 from "d3";
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { schemeCategory10 } from 'd3-scale-chromatic'
import { legendColor } from 'd3-svg-legend';
import { geoPath, geoMercator } from 'd3-geo';
import { random } from 'lodash-es';
import { abuseData, extent, getRate, stateMean } from './util-data.js';

// import Vue from "vue";
import VueTippy, { TippyComponent } from "vue-tippy";

// import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css'; // optional for styling
import 'tippy.js/themes/light-border.css'; // optional for styling
import { color } from 'd3';

const defaults = {
    container: '#chart',
    height: 500,
    margin: {
        top: 30,
        left: 60,
        bottom: 60,
        right: 30,
    },
    width: 500,
};

export default class WealthAndHealthOfNations {
    constructor(props) {
        let frames = `
          <div id="main-container">
              <div id="map-meta-container">
                  <div id="map">
                      <div id="title"></div>
                      <div id="vis">
                          <div id="geo">
                            <span id="filter-button" class="material-icons-outlined">
                              

                              <tippy
                                interactive 
                                :animate-fill="false" 
                                distant="7" 
                                animation="fade" 
                                trigger="click" 
                                placement = 'bottom-start'
                                theme="light"
                                arrow="false"
                                >

                                <template v-slot:trigger>
                                    <span title="Filters" id="filter-button" class="material-icons-outlined">filter_list</span>
                                </template>

                                <span style='text-align:left;'>
                                  <div style='margin-bottom:20px;'>Filter Examples</div>

                                  <div>Years: {{ soptions.value }}</div>
                                  <vue-slider
                                    :min="2000"
                                    :max="2020"
                                    ref="slider"
                                    v-on:change="myChange"
                                    v-model="soptions.value"
                                    v-bind="first"
                                    v-bind="soptions"
                                  ></vue-slider>
                                  <div style='display:none'>{{ soptions.value }}{{ first }}{ { aoptions.value }} </div>

                                  <div style='margin:10px 0px;'>Toggle Attribute: {{ gend }}</div>
                                  <button @click="gend = gend=='false'?'true':'false'" style="display:block; margin-bottom:5px;">Toggle</button>

                                  <div>Religion</div>
                                  <multiselect style='width:300px; z-index:10;' v-model="value" :options="msoptions" :multiple="true" :searchable="true" :close-on-select="false" :show-labels="false" placeholder="Pick a value"></multiselect>
                                  <pre style='display:none' class="language-json"><code>{{ value  }}</code></pre>
                                </span>
                              </tippy>


                            </span>
                            <div id="filter-legend"></div>
                          </div>
                          <div id="year-control"></div>
                      </div>
                      <div id="howto">
                          Hover over an icon or click on a state. Use the filter for more specific results.
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
                          Hover over the chart or select a specific case.
                      </div>
                  </div> 
              </div> 
          </div>
        `
        var d1 = document.querySelector(props.container);
        d1.insertAdjacentHTML('beforeend', frames);

        props.data.forEach(g => {
            // d3 has a non-spec winding issue.  Rewind it and we are good.
            // https://stackoverflow.com/questions/49311001/d3-js-drawing-geojson-incorrectly
            g.features = g.features.map(function(feature) {
                return turf.rewind(feature, { reverse: true });
            })
            g.allFeatures = g.features; // for filtering
        });

        this.allData = props.data;
        props.data = props.data[0];
        props.crNAME1 = 'Pakistan';

        // tippy('#filter-button', {
        //     content: '<b>My tooltip!</b>',
        //     allowHTML: true,
        //     animation: 'fade',
        //     arrow: false,
        //     interactive: true,
        //     interactiveBorder: 20,
        //     interactiveDebounce: 75,
        //     maxWidth: 350,
        //     offset: [0, 5],
        //     placement: 'bottom-start',
        //     theme: 'light-border',
        //     trigger: 'click',
        // });

        this.vui = new Vue({
            el: props.container + ' #main-container',
            data(d) {
                return {
                    gend: 'false',
                    value: '',
                    first: 0,
                    // aoptions: { value: [2000, 2020] },
                    soptions: { value: [2000, 2020] },
                    msoptions: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
                    metaFilterTypes: ["Show by Category", "Download Case"],
                    mftValue: "Show by Category",
                    metaFilterCases: ["Name 1", "Name 2", "Name 3"],
                    mfcValue: "Religion",
                    metaFilterCategories: ["Religion", "during", "torture_type", "torture_methods", "hosp_med", "reason", "constituency", "complaint_filed", "mlc_conducted", "mlc_law", "outcome", "gender", "societal_background", "religion", "ethnicity", "action"]
                }
            },
            methods: {
                myChange: function(a, b, c, d) {
                    this.first = this.soptions.value[0]
                },
                eventMFT: (function(val, id) {
                    if (val == "Show by Category") {
                        this.vui.metaFilterCategories = ["Religion", "during", "torture_type", "torture_methods", "hosp_med", "reason", "constituency", "complaint_filed", "mlc_conducted", "mlc_law", "outcome", "gender", "societal_background", "religion", "ethnicity", "action"]
                        this.vui.mfcValue = "Religion";
                        d3.selectAll('#meta svg *')
                            .attr("opacity", 1)
                            .style("pointer-events", "auto");
                    } else {
                        this.vui.metaFilterCategories = ["Case 1", "Case 2", "Case 3"];
                        this.vui.mfcValue = "";
                        d3.selectAll('#meta svg *')
                            .attr("opacity", .5)
                            .style("pointer-events", "none");
                    }
                }).bind(this),
                eventMFC: (function(val, id) {
                    alert('Test data not yet delivered.')
                })
            },
            mounted() {},
            components: {
                multiselect: window.VueMultiselect.Multiselect,
                'vueSlider': window['vue-slider-component'],
            }
        })


        this._init({...defaults, ...props });
    }

    _updateProps(props) {
        this.props = {...this.props, ...props };
        return this.props;
    }

    legend(s, target) {
        target.append("g")
            .attr("class", "legendLinear")
            .attr("transform", `translate(10,${target.node().clientHeight-40})`)

        var sc = d3.scaleLinear()
            .domain([0, 10])
            .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

        let labels = Array(81).fill("");
        labels[0] = 20;
        labels[40] = 10;
        labels[80] = 0;

        var legendLinear = legendColor()
            .shapeWidth(2)
            .title('Cases')
            .shapeHeight(10)
            .ascending(true)
            .labelFormat('d')
            .shapePadding(-.2)
            .labels(labels)
            .cells(81)
            .orient('horizontal')
            .scale(s);

        target.select(".legendLinear")
            .call(legendLinear);
    }

    _init(props) {
        this._updateProps(props);

        let isResize = "width" in props && "height" in props && Object.keys(props).length == 2;

        let initFcns = [
            { fcn: 'initMapTitle', sel: '#map #title' },
            { fcn: 'initGeo', sel: '#map #vis #geo' },
            { fcn: 'initInMap', sel: '#map #vis #filter-legend' },
            { fcn: 'initRHS', sel: '#meta #vis' }
        ];
        initFcns.forEach(d => {
            let el = document.querySelector(this.props.container + ` ${d.sel}`);
            this[d.fcn]({...this.props, containerEl: el, width: el.clientWidth, height: el.clientHeight, isResize })
        });
    }

    initMapTitle(props) {
        let title = `Incident View: <span id="location">${props.crNAME1}</span>`;

        select(props.containerEl).html(title); // ${tot}`);
    }

    initInMap(props) {}

    initGeo(props) {
        let dur = props.isResize ? 0 : 500;
        let proj = geoMercator().fitSize([props.width, props.height - 30], props.data)
        let changeRegion = this.changeRegion.bind(this);

        // feature color scale
        let steps = 6;
        let sc = d3.scaleLinear().domain(extent);
        let colorScale = d3.scaleLinear().domain(sc.ticks(steps)).range(d3.quantize(d3.interpolateViridis, steps));

        // add features
        if (!this.geo) {
            this.geo = select(props.containerEl)
                .append('svg')
                .attr('width', props.width)
                .attr('height', props.height)
                .on("click", (function() {
                    if (this.props.crNAME1 == "Pakistan") return;
                    let width = props.containerEl.clientWidth;
                    let height = props.containerEl.clientHeight;
                    changeRegion(null, {...props, width, height });
                }).bind(this))

            this.legend(colorScale, this.geo);
        }

        const t = this.geo.transition().duration(dur);

        this.geo
            .attr('width', props.width)
            .attr('height', props.height)

        this.geo.selectAll("g.features") // remove old features
            //.selectAll('path:not([data-name1="Northern Areas"])')
            .transition()
            .duration(dur * .6)
            .style("opacity", 0)
            .remove();

        this.geo.append("g")
            .attr('class', 'features')
            .selectAll("path")
            .data(props.data.features)
            .join(
                enter => enter.append("path")
                .attr("fill", d => {
                    let g2 = d.properties.GID_2;
                    let rate = 0;
                    if (g2) // using second geopath data
                        rate = getRate(g2);
                    else { // add em up
                        rate = stateMean[d.properties.NAME_1];
                    }

                    //console.log(`${g2}, ${rate}, ${s(rate)} %cXXX`, `color:${d3.interpolateViridis(s(rate))};`);
                    return colorScale(rate);
                })
                .attr("data-name1", d => d.properties.NAME_1)
                .attr("data-name2", d => d.properties.NAME_2)
                .attr("data-name3", d => d.properties.NAME_3)
                .attr("data-gid2", d => d.properties.GID_2)
                .attr("stroke", "black")
                .style("cursor", "pointer")
                .attr("d", geoPath(proj))
                .on("click", function() {
                    event.stopPropagation();
                    if (props.crNAME1 != 'Pakistan') return;
                    changeRegion(this, props);
                })
                .attr("opacity", 0)
                .call(enter => enter.transition(t).attr("opacity", 1))
                .append("title").text(d => {
                    if (d.properties.GID_2)
                        return `${d.properties.GID_2}: ${abuseData.filter(ad => ad.g2 == d.properties.GID_2)[0].incidents.length} cases`
                    else
                        return `${d.properties.NAME_1}: Mean ${stateMean[d.properties.NAME_1]} cases`
                }),

                update => update
                .attr("opacity", "0")
                .call(update => update.transition(t).attr("opacity", 1)),

                exit => exit
                .attr("opacity", "1")
                .call(exit => exit.transition(t)
                    .attr("opacity", 0)
                    .remove())
            );


    }

    changeRegion(el, props) {
        let data, name;

        if (el) {
            name = select(el).attr("data-name1");
            data = this.allData[1];
            data.features = data.allFeatures.filter(d => d.properties.NAME_1 == name);
        } else {
            data = this.allData[0];
            data.features = data.allFeatures;
        }

        let crNAME1 = name ? name : 'Pakistan';

        this._init({...props, data, crNAME1 });
        // this.initInMap(props, select(el).attr("data-gid2"), name)
    }

    initRHS(props) {
        let sel = props.containerEl; // document.querySelector(props.container);

        var data = [{
            values: [16, 15, 12, 6, 5, 4],
            labels: ["Muslim", "Hindu", "Christian", "Ahmadiyya", "Sikh", "Other"],
            domain: { column: 0 },
            name: 'NAME',
            hoverinfo: '', //'label+percent+name',
            hole: .4,
            type: 'pie',
            marker: {
                colors: ['#6388b4', '#ef6f6a', '#8cc2ca', '#55ad89', '#c3bc3f', '#bb7693', '#baa094', '#a9b5ae', '#767676', '#ffae34'],
            },
        }];


        let selRows = abuseData;
        if (props.crNAME1 != 'Pakistan') {
            selRows = abuseData.filter(d => d.n1 == props.crNAME1);
        }
        let tot = d3.sum(selRows.map(d => d.incidents.length));

        var layout = {
            xtitle: 'CASES OF ABUSE',
            annotations: [{
                font: {
                    size: 40
                },
                showarrow: false,
                text: tot,
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
            xheight: 400,
            xwidth: 600,
            showlegend: true,
            grid: { rows: 1, columns: 1 }
        };

        var config = { responsive: true }

        if (!this.metaVis) {
            this.metaVis = Plotly.newPlot(sel, data, layout, config);

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
            Plotly.react(sel, data, layout, config);
        }
    }

    render(props) { // receives new scroll updates
        console.log('update called');
        // update
    }

    resize(props) {
        this._init(props);
    }
}


// export default class WealthAndHealthOfNations {
class old_WealthAndHealthOfNations {
    constructor(props) {
        this._init({...defaults, ...props });
    }

    _updateProps(props) {
        this.props = {...this.props, ...props };
        return this.props;
    }

    _init(props) {
        const {
            container,
            height,
            legendArray,
            margin,
            rDomain,
            xDomain,
            yDomain,
            yearDomain,
            width,
        } = this._updateProps(props);

        /** build svg */
        this.svg = select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        /** X SCALE & AXIS */
        this.xScale = scaleLog()
            .domain(xDomain)
            .range([margin.left, width - margin.right]);

        this.xAxis = g => g
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(axisBottom(this.xScale).ticks(width / 80, ','))
            .call(g => g.select('.domain').remove());

        this.svg
            .append('text')
            .attr('transform', `translate(${width / 2} ,${height - margin.bottom / 2})`)
            .style('text-anchor', 'middle')
            .style('font-size', 12)
            .text('Income per capita (inflation adjusted dollars)');

        this.svg.append('g')
            .call(this.xAxis);

        this.yScale = scaleLinear()
            .domain(yDomain)
            .range([height - margin.bottom, margin.top]);

        /** Y SCALE & AXIS */
        this.yAxis = g => g
            .attr('transform', `translate(${margin.left},0)`)
            .call(axisLeft(this.yScale))
            .call(g => g.select('.domain').remove());

        this.svg.append('g')
            .call(this.yAxis);

        this.svg
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', margin.left / 3)
            .attr('x', 0 - height / 2)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', 12)
            .text('Life expectancy (years)');

        /** RADIUS SCALE */
        this.rScale = scaleSqrt()
            .domain(rDomain)
            .range([1, 50]);

        /** COLOR SCALE */
        this.cScale = scaleOrdinal()
            .domain(legendArray)
            .range(schemeCategory10);

        /** YEAR SCALE & LABEL */
        this.yearScale = scaleLinear()
            .domain(yearDomain)
            .range([0, yearDomain[1] - yearDomain[0]]);

        this.yearLabel = this.svg.append('g')
            .style('font-size', 50)
            .style('opacity', 0.3)
            .attr('transform', `translate(${margin.left + 10}, ${margin.top + 40})`)
            .append('text')
            .text(Math.max(yearDomain) || '');

        /** SCATTER GROUP */
        this.scatter = this.svg.append('g')
            .attr('stroke', '#000')
            .attr('stroke-opacity', 0.2);

        /** LEGEND */
        this.svg.append('g')
            .attr('class', 'legendOrdinal')
            .style('font-size', 13)
            .style('opacity', 0.7)
            .attr('transform', `translate(${width - width / 3}, ${height - height / 2.8})`);

        const legendOrdinal = legendColor()
            .shape('circle')
            .shapeRadius(8)
            .title('Regions')
            .titleWidth(100)
            .scale(this.cScale);

        this.svg.select('.legendOrdinal')
            .call(legendOrdinal);
    }

    render(props) {
        const {
            data,
            duration = 500,
            year,
            yearDomain,
        } = this._updateProps(props);

        const yearIndex = year ? Math.floor(this.yearScale(year)) : this.yearScale.range()[0];

        const update = this.scatter
            .selectAll('circle')
            .data(data, (d) => {
                return d.name;
            });

        this.yearLabel
            .text(year || yearDomain[0] || '');

        update
            .enter().append('circle')
            .attr('cx', d => this.xScale(d.income[yearIndex]))
            .attr('cy', d => this.yScale(d.lifeExpectancy[yearIndex]))
            .merge(update)
            .transition()
            .duration(duration)
            .attr('cx', d => this.xScale(d.income[yearIndex]))
            .attr('cy', d => this.yScale(d.lifeExpectancy[yearIndex]))
            .attr('fill', d => this.cScale(d.region))
            .attr('opacity', 0.7)
            .attr('r', d => this.rScale(d.population[yearIndex]));

        update.exit().remove();
    }

    resize(props) {
        this.svg.remove();
        this._init(props);
    }
}