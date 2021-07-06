import { isNil } from 'lodash-es';
import { select } from 'd3-selection';

export const highlightLines = (baseSelection, linesArray, highlightColor) => {
    if (linesArray instanceof Array) {
        linesArray.forEach((line) => {
            baseSelection.select(`li:nth-child(${line})`)
                .style('background', highlightColor, 'important')
                .style('border-radius', '5px');
        });
    }
};

export const updateImage = (graphId, state, previousimgFileName) => {
    const {
        imgFileName,
    } = state;
    if (isNil(imgFileName)) {
        const graph = select(`#${graphId} .imageDiv`);
        graph
            .transition()
            .duration(250)
            .style('opacity', 0);
    }
    if (imgFileName !== previousimgFileName) {
        const html = imgFileName ?
            `<img src="dist/images/${imgFileName}" />` :
            null;
        const graph = select(`#${graphId} .imageDiv`);
        graph
            .transition()
            .duration(250)
            .style('opacity', 0)
            .on('end', () => {
                graph
                    .html(html)
                    .transition()
                    .duration(250)
                    .style('opacity', imgFileName ? 1 : 0);
            });
    }
};