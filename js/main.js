import tortureVis from "./visualization.js"

// function addTextBuffers() {
//   d3.selectAll('.section').each(function(d) {
//     let child = d3.select(this).select('.narration-question').node();
//     d3.select(child).select('#scrollBuffer').remove();

//     if (child && (child.clientHeight > this.scrollHeight)) {
//       d3.select(child).append('div')
//         .attr('id', 'scrollBuffer')
//         .style('height', '30vh')
//         .style('width', '1px');
//     }
//   });
// }

function initTortureVis(data) {
  window.tv = new tortureVis({
    container: "#tortureVis #main",
    data: data
  });
}

function initFullpage() {
  let fp = new fullpage('#fullpage', {
    // paddingTop: "30px",
    // paddingBottom: "30px",
    responsiveWidth: 1100,

    controlArrows: false,
    navigation: true,
    navigationPosition: "right",
    slidesNavigation: true,
    slidesNavPosition: "top",
    // afterResize: function(width, height) {
    //   window.tv.build({
    //     width,
    //     height
    //   });
    //   console.log('Resize:', width, height);
    //   console.log("Body", document.body.clientWidth, document.body.clientHeight);
    //   fullpage_api.reBuild();
    // },
    // afterRender: function() {
    //   // window.tv.addTextBuffers();
    //   // bug hack: putting rebuild in afterRender then reloading WITH cache
    //   // setTimeout(d => fullpage_api.reBuild(), 100);
    // }
    normalScrollElements: '#tortureVis #filters, .select2-results__options',
    // afterLoad: d => window.tv.tip.show(),
    // onLeave: d => window.tv.tip.hide(),
    // afterSlideLoad: d => window.tv.tip.show(),
    // onSlideLeave: d => window.tv.tip.hide(),
  });
}

// let dataPath = "data/";
// let promises = [];
// let files = [
//   // "PAK_adm0.json",
//   "PAK_adm1.json",
//   "PAK_adm2.json",
//   // "PAK_adm3.json",
// ]

// files.forEach(d =>
//   promises.push(d3.json(dataPath + d))
// );

// Promise.all(promises).then(d => {
initTortureVis();
d3.selectAll(".section")
  .classed("fp-auto-height-responsive", true);
initFullpage();
// setTimeout(initFullpage, 1000)
// })