import {
    scaleLinear,
    scaleLog,
    scaleOrdinal,
    scaleSqrt,
} from 'd3-scale';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { schemeCategory10 } from 'd3-scale-chromatic'
import { legendColor } from 'd3-svg-legend';
import { geoPath } from 'd3-geo';
import { geoMercator } from 'd3-geo';
import { random } from 'lodash-es';

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

        let frames = `
            <div id="main-container">
                <div id="map-meta-container">
                    <div id="map">
                        <div id="filter-control"></div>
                        <div id="vis">
                            <div id="geo"></div>
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
        var d1 = document.querySelector(container);
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

        let initFcns = [{ fcn: 'initGeo', sel: '#map #vis #geo' }];
        initFcns.forEach(d => {
            let el = document.querySelector(container + ` ${d.sel}`);
            this[d.fcn]({...props, containerEl: el, width: el.clientWidth, height: el.clientHeight })
        });
    }

    initGeo(props) {
        var randomColor = (function() {
            var golden_ratio_conjugate = 0.618033988749895;
            var h = Math.random();

            var hslToRgb = function(h, s, l) {
                var r, g, b;

                if (s == 0) {
                    r = g = b = l; // achromatic
                } else {
                    function hue2rgb(p, q, t) {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                        if (t < 1 / 2) return q;
                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    }

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }

                return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
            };

            return function() {
                h += golden_ratio_conjugate;
                h %= 1;
                return hslToRgb(h, 0.5, 0.60);
            };
        })();

        /** build svg */
        this.svg = select(props.containerEl)
            .append('svg')
            .attr('width', props.width)
            .attr('height', props.height)
            .on("click", function() {
                changeRegion(null, props);
            })

        let proj = geoMercator().fitSize([props.width, props.height], props.data)
        let changeRegion = this.changeRegion.bind(this);
        const t = this.svg.transition().duration(2000);

        this.svg.append("g")
            .selectAll("path")
            .data(props.data.features)
            .join(
                enter => enter.append("path")
                .attr("fill", randomColor)
                .attr("data-name1", d => d.properties.NAME_1)
                .attr("data-name2", d => d.properties.NAME_2)
                .attr("data-name3", d => d.properties.NAME_3)
                .attr("stroke", "black")
                .style("cursor", "pointer")
                .attr("d", geoPath(proj))
                .on("click", function() {
                    changeRegion(this, props);
                    select(this)
                        .attr("fill", randomColor);
                })
                // .attr("x", (d, i) => i * 16)
                // .attr("y", -30)
                .attr("opacity", 0)
                .call(enter => enter.transition(t).attr("opacity", 1))
                .append("title").text(d => `${d.properties.NAME_1}: X cases`),

                update => update
                .attr("opacity", "1")
                .call(update => update.transition(t).attr("opacity", 0)),

                exit => exit
                .attr("opacity", "1")
                .call(exit => exit.transition(t)
                    .attr("opacity", 0)
                    .remove())
            )
            // .attr("fill", randomColor) // color by intensity
            // .attr("data-name1", d => d.properties.NAME_1)
            // .attr("data-name2", d => d.properties.NAME_2)
            // .attr("data-name3", d => d.properties.NAME_3)
            // .attr("stroke", "black")
            // .style("cursor", "pointer")
            // .attr("d", geoPath(proj))
            // .on("click", function() {
            //     changeRegion(this, props);
            //     select(this)
            //         .attr("fill", randomColor);
            // })
            // .attr("opacity", 0),
            // .call(enter => enter.transition(t).attr("opacity", 1));

        // this.svg.selectAll("path")
        //     .append("title").text(d => `${d.properties.NAME_1}: X cases`);
    }

    changeRegion(el, props) {
        let data;

        if (el) {
            let name = select(el).attr("data-name1");
            data = this.allData[1];
            data.features = data.allFeatures.filter(d => d.properties.NAME_1 == name);
        } else {
            data = this.allData[0];
            data.features = data.allFeatures;
        }

        event.stopPropagation();
        document.querySelector('svg').remove();
        this.initGeo({...props, data })
    }

    render(props) {
        // update
    }

    resize(props) {
        this.svg.remove();
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