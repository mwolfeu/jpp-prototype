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
  let fpCfg = {
    // paddingTop: "30px",
    // paddingBottom: "30px",
    responsiveWidth: 1100,

    controlArrows: false,
    // navigation: true,
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
  }

  if (!('visData' in window))
    fpCfg.navigation = "true";

  let fp = new fullpage('#fullpage', fpCfg);
}

function setAdminMode() { // hide all sections except tortureVis
  document.querySelectorAll('.section').forEach(d => {
    if (d.id != "tortureVis")
      d.remove();
  })
}

let urlSearchParams = new URLSearchParams(window.location.search);

if (urlSearchParams.has('vis-data')) {
  try {
    window.visData = JSON.parse(urlSearchParams.get('vis-data'));
    setAdminMode();
  } catch (error) {
    console.error('Bad JSON data in URL.', error);
  }
}

initTortureVis();
// d3.selectAll(".section")
//   .classed("fp-auto-height-responsive", true);
document.querySelectorAll('.section').forEach(d =>
  d.classList.add("fp-auto-height-responsive"))

initFullpage();