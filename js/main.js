import tortureVis from "./visualization.js"

// const debounce = (fn, delay) => { // debounce events
//     let timeOutId;
//     return function(...args) {
//         if (timeOutId) {
//             clearTimeout(timeOutId);
//         }
//         timeOutId = setTimeout(() => {
//             fn(...args);
//         }, delay);
//     }
// }

// function checkOverflow(el) { // checks overflow state
//     var curOverflow = el.style.overflow;

//     if (!curOverflow || curOverflow === "visible")
//         el.style.overflow = "hidden";

//     var isOverflowing = el.clientWidth < el.scrollWidth ||
//         el.clientHeight < el.scrollHeight;

//     el.style.overflow = curOverflow;
//     return isOverflowing;
// }

function addTextBuffers() {
  d3.selectAll('.section').each(function(d) {
    let child = d3.select(this).select('.narration-question').node();
    d3.select(child).select('#scrollBuffer').remove();

    // if (checkOverflow(this)) {
    if (child && (child.clientHeight > this.scrollHeight)) {
      d3.select(child).append('div')
        .attr('id', 'scrollBuffer')
        .style('height', '30vh')
        .style('width', '1px');
    }
  });
}

function initTortureVis(data) {
  // function fixit() {
  //   let numNodes = d3.selectAll('.section').nodes().length;
  //   window.fullpage_api.silentMoveTo(numNodes);
  //   window.fullpage_api.silentMoveTo(1);
  // }

  window.tv = new tortureVis({
    container: "#tortureVis",
    data: data
  });
}

function initFullpage() {
  let fp = new fullpage('#fullpage', {
    // paddingTop: "30px",
    // paddingBottom: "30px",
    // sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE'],
    // anchors: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    // menu: '#menu',
    // autoScrolling: false,
    responsiveWidth: 1100,

    controlArrows: false,
    navigation: true,
    navigationPosition: "right",
    // navigationTooltips: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    slidesNavigation: true,
    slidesNavPosition: "top",
    // scrollOverflow: true,
    afterResize: function(width, height) {
      // var fullpageContainer = this;
      window.tv._init({
        width,
        height
      });
      console.log('Resize:', width, height);
      console.log("Body", document.body.clientWidth, document.body.clientHeight);
      fullpage_api.reBuild();
    },
    afterRender: function() {
      window.tv.addTextBuffers();
      // bug hack: putting rebuild in afterRender then reloading WITH cache
      setTimeout(d => fullpage_api.reBuild(), 100);
    }
  });
}

let dataPath = "data/";
let promises = [];
let files = [
  // "PAK_adm0.json",
  "PAK_adm1.json",
  "PAK_adm2.json",
  // "PAK_adm3.json",
]

files.forEach(d =>
  promises.push(d3.json(dataPath + d))
);

Promise.all(promises).then(d => {
  initTortureVis(d);
  d3.selectAll(".section")
    .classed("fp-auto-height-responsive", true);
  // initFullpage();
  setTimeout(initFullpage, 1000)
})

// window.addEventListener('resize', d => {
//   let el = d3.select('#section0');
//   let c = el.style('background-color');
//   el.style('background-color', c == 'blue' ? 'red' : 'blue');
// });

// setInterval(d => {
//   console.log('resize');
//   window.dispatchEvent(new Event('resize'))
// }, 1000);