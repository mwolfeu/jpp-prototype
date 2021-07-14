import * as d3 from "d3";

let getRate = function(g2) {
    return abuseData.filter(d => d.g2 == g2)[0].incidents.length;
}

let states = [
    "Azad Kashmir",
    "Baluchistan",
    "F.A.T.A.",
    "F.C.T.",
    "N.W.F.P.",
    "Northern Areas",
    "Punjab",
    "Sind"
];

let extent = [0, 20].reverse();

// data.allFeatures.map(d => {return {n1:d.properties.NAME_1, g2:d.properties.GID_2, incidents:Array(parseInt(Math.random()*20)).fill({})}})
let abuseData = [{
        "n1": "Azad Kashmir",
        "g2": "PAK.1.1_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Baluchistan",
        "g2": "PAK.2.1_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Baluchistan",
        "g2": "PAK.2.2_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Baluchistan",
        "g2": "PAK.2.3_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Baluchistan",
        "g2": "PAK.2.4_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Baluchistan",
        "g2": "PAK.2.5_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Baluchistan",
        "g2": "PAK.2.6_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "F.A.T.A.",
        "g2": "PAK.3.1_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "F.C.T.",
        "g2": "PAK.4.1_1",
        "incidents": []
    },
    {
        "n1": "N.W.F.P.",
        "g2": "PAK.5.1_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "N.W.F.P.",
        "g2": "PAK.5.2_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "N.W.F.P.",
        "g2": "PAK.5.3_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "N.W.F.P.",
        "g2": "PAK.5.4_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "N.W.F.P.",
        "g2": "PAK.5.5_1",
        "incidents": [
            {}
        ]
    },
    {
        "n1": "N.W.F.P.",
        "g2": "PAK.5.6_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "N.W.F.P.",
        "g2": "PAK.5.7_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "N.W.F.P.",
        "g2": "PAK.5.8_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Northern Areas",
        "g2": "PAK.6.1_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Punjab",
        "g2": "PAK.7.1_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Punjab",
        "g2": "PAK.7.2_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Punjab",
        "g2": "PAK.7.3_1",
        "incidents": []
    },
    {
        "n1": "Punjab",
        "g2": "PAK.7.4_1",
        "incidents": [
            {},
            {}
        ]
    },
    {
        "n1": "Punjab",
        "g2": "PAK.7.5_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Punjab",
        "g2": "PAK.7.6_1",
        "incidents": [
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Punjab",
        "g2": "PAK.7.7_1",
        "incidents": []
    },
    {
        "n1": "Punjab",
        "g2": "PAK.7.8_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Sind",
        "g2": "PAK.8.1_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Sind",
        "g2": "PAK.8.2_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Sind",
        "g2": "PAK.8.3_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Sind",
        "g2": "PAK.8.4_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Sind",
        "g2": "PAK.8.5_1",
        "incidents": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    },
    {
        "n1": "Sind",
        "g2": "PAK.8.6_1",
        "incidents": []
    }
];

let stateMean = {};

states.forEach(n1 => {
    let gid2s = abuseData.filter(ad => ad.n1 == n1);
    stateMean[n1] = d3.mean(gid2s.map(d => getRate(d.g2)));
});

export { stateMean, extent, abuseData, getRate }


// var randomColor = (function() {
//   var golden_ratio_conjugate = 0.618033988749895;
//   var h = Math.random();

//   var hslToRgb = function(h, s, l) {
//       var r, g, b;

//       if (s == 0) {
//           r = g = b = l; // achromatic
//       } else {
//           function hue2rgb(p, q, t) {
//               if (t < 0) t += 1;
//               if (t > 1) t -= 1;
//               if (t < 1 / 6) return p + (q - p) * 6 * t;
//               if (t < 1 / 2) return q;
//               if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
//               return p;
//           }

//           var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//           var p = 2 * l - q;
//           r = hue2rgb(p, q, h + 1 / 3);
//           g = hue2rgb(p, q, h);
//           b = hue2rgb(p, q, h - 1 / 3);
//       }

//       return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
//   };

//   return function() {
//       h += golden_ratio_conjugate;
//       h %= 1;
//       return hslToRgb(h, 0.5, 0.60);
//   };
// })();