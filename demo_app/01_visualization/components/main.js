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
                      <div id="title">Abuse Cases by Region</div>
                      <div id="vis">
                          <div id="geo">
                            <span id="filter-button" class="material-icons-outlined">filter_list</span>
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
                      <div id="vis"></div>
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

        this._init({...defaults, ...props });
    }

    _updateProps(props) {
        this.props = {...this.props, ...props };
        return this.props;
    }

    legend(s, target) {
        target.append("g")
            .attr("class", "legendLinear")
            .attr("transform", `translate(10,${target.node().clientHeight-30})`)
            .style("font-size", "16px");

        var sc = d3.scaleLinear()
            .domain([0, 10])
            .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

        let i = 0;
        var legendLinear = legendColor()
            .shapeWidth(30)
            .shapeHeight(10)
            .ascending(true)
            .labels(s.domain()) // d => d.i
            // .cells([0, 5, 10, 15, 20])
            .orient('horizontal')
            .scale(s);

        target.select(".legendLinear")
            .call(legendLinear);
    }

    _init(props) {
        this._updateProps(props);

        let isResize = "width" in props && "height" in props && Object.keys(props).length == 2;

        let initFcns = [{ fcn: 'initMapTitle', sel: '#map #title' },
            { fcn: 'initGeo', sel: '#map #vis #geo' },
            { fcn: 'initInMap', sel: '#map #vis #filter-legend' }
        ];
        initFcns.forEach(d => {
            let el = document.querySelector(this.props.container + ` ${d.sel}`);
            this[d.fcn]({...this.props, containerEl: el, width: el.clientWidth, height: el.clientHeight, isResize })
        });
    }

    initMapTitle(props) {}

    initInMap(props) {
        let sel = abuseData;
        if (props.crNAME1 != 'Pakistan') {
            sel = abuseData.filter(d => d.n1 == props.crNAME1);
        }

        let tot = d3.sum(sel.map(d => d.incidents.length));
        select(props.containerEl).text(`${props.crNAME1} Total: ${tot}`);
    }

    initGeo(props) {
        let dur = props.isResize ? 0 : 500;
        let proj = geoMercator().fitSize([props.width, props.height], props.data)
        let changeRegion = this.changeRegion.bind(this);

        /** build svg */
        if (!this.geo) {
            this.geo = select(props.containerEl)
                .append('svg')
                .on("click", (function() {
                    if (this.props.crNAME1 == "Pakistan") return;
                    let width = props.containerEl.clientWidth;
                    let height = props.containerEl.clientHeight;
                    changeRegion(null, {...props, width, height });
                }).bind(this))
        }

        const t = this.geo.transition().duration(dur);

        this.geo
            .attr('width', props.width)
            .attr('height', props.height)

        this.geo.selectAll("g") // remove old features
            //.selectAll('path:not([data-name1="Northern Areas"])')
            .transition()
            .duration(dur * .6)
            .style("opacity", 0)
            .remove();

        let steps = 6;
        let sc = d3.scaleLinear().domain(extent);
        let colorScale = d3.scaleLinear().domain(sc.ticks(steps)).range(d3.quantize(d3.interpolateViridis, steps));
        this.legend(colorScale, this.geo);

        this.geo.append("g")
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
                .attr("opacity", "1")
                .call(update => update.transition(t).attr("opacity", 0)),

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