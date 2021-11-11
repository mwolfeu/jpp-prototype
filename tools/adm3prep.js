fs = require('fs')

// Normalize feature province & district names

// let x = ['Khyber Pakhtunkhawa', 'Punjab', 'Sindh', 'Balochistan']

// Set an object path value
function pSet(obj, path, val) {
  if (!path) return;

  let byName = path.split('.');
  for (let i = 0; i < byName.length - 1; i++) {
    if (!(byName[i] in obj)) obj[byName[i]] = {};
    obj = obj[byName[i]];
  }
  obj[byName.pop()] = val;
}

// ORIG
// let altDistricts = {
//   'Attock': "Attok",
//   'Bajur': "Bajaur",
//   'Batagram': "Battagram",
//   'Bhakhar': "Bhakkar",
//   'Bunair': "Buner",
//   'Charsada': "Charsadda",
//   // 'Chiniot': "",
//   'D. G. Khan': "Dera Ghazi Kha",
//   'D. I. Khan': "Dera Ismail Khan",
//   // 'Duki': "",
//   'Gujranwala': "Gujranwala 1", // merge "Gujranwala 2",
//   // 'Harnai': "",
//   'Jacobabad': "Jakobabad",
//   'Jaffarabad': "Jafarabad",
//   'Jehlum': "Jhelum",
//   // 'Kachhi/Bolan': "",
//   'Karachi Malir': "Malir",
//   'Karachi West': "Karachi west",
//   'Kech/Turbat': "Kech",
//   'Kohlu': "Kholu",
//   // 'Korangi': "",
//   'Lower Dir': "Dir", // avg w UPPER DIR
//   'Malakand': "Malakand P.A.",
//   // 'Mandi Bahauddin': "",
//   'Musa Khel': "Musakhel",
//   'Muzaffar Garh': "Muzaffargarh",
//   'Narowal 226': "Narowal 1", // merge "Narowal 2"
//   'Nasirabad/Tamboo': "Nasirabad",
//   'North Waziristan': "N. Waziristan",
//   'Nowshero Feroze': "Naushahro Firoz",
//   'Nushki': "",
//   'Panjgoor': "Panjgur",
//   'Rahim Yar Khan': "Rahimyar Khan",
//   'Rajanpur': "Rajan Pur",
//   // 'Shahdadkot': "",
//   'Shaheed Banazir Abad': "Nawab Shah",
//   // 'Shaheed Sikandar Abad': "",
//   // 'Sherani': "",
//   'Sibbi': "Sibi",
//   // 'Sohbatpur': "",
//   'South Waziristan': "S. Waziristan",
//   // 'Sujawal': "",
//   'T.T. Singh': "Toba Tek Singh",
//   'Tando Allah Yar': "Tando Allahyar",
//   'Tando Muhammad Khan': "Tando M. Khan",
//   // 'Tharparkar': "",
//   // 'Tor Garh': "",
//   'Umer Kot': "Umerkot",
//   'Upper Dir': "Dir",
//   // 'Washuk': ""
// };

let allIDs = [];

// map => data
let altProvinces = {
  "F.A.T.A.": "Khyber Pakhtunkhawa",
  "N.W.F.P.": "Khyber Pakhtunkhawa",
  "F.C.T.": "Punjab",
  "Baluchistan": "Balochistan",
  "Sind": "Sindh",
};

// REVERSED
let altDistricts = { "Attok": "Attock", "Bajaur": "Bajur", "Battagram": "Batagram", "Bhakkar": "Bhakhar", "Buner": "Bunair", "Charsadda": "Charsada", "Dera Ghazi Kha": "D. G. Khan", "Dera Ismail Khan": "D. I. Khan", "Gujranwala 1": "Gujranwala", "Jakobabad": "Jacobabad", "Jafarabad": "Jaffarabad", "Jhelum": "Jehlum", "Malir": "Karachi Malir", "Karachi west": "Karachi West", "Kech": "Kech/Turbat", "Kholu": "Kohlu", "Dir": "Upper Dir", "Malakand P.A.": "Malakand", "Musakhel": "Musa Khel", "Muzaffargarh": "Muzaffar Garh", "Narowal 1": "Narowal 226", "Nasirabad": "Nasirabad/Tamboo", "N. Waziristan": "North Waziristan", "Naushahro Firoz": "Nowshero Feroze", "": "Nushki", "Panjgur": "Panjgoor", "Rahimyar Khan": "Rahim Yar Khan", "Rajan Pur": "Rajanpur", "Nawab Shah": "Shaheed Banazir Abad", "Sibi": "Sibbi", "S. Waziristan": "South Waziristan", "Toba Tek Singh": "T.T. Singh", "Tando Allahyar": "Tando Allah Yar", "Tando M. Khan": "Tando Muhammad Khan", "Umerkot": "Umer Kot" };



fs.readFile('../data/PAK_adm3.json', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  let map = JSON.parse(data);
  // add extra properties
  map.features.forEach(d => {
    let pr = altProvinces[d.properties.NAME_1] || d.properties.NAME_1;
    let di = altDistricts[d.properties.NAME_3] || d.properties.NAME_3;
    delete d.properties; // save space
    d.id = pr + '~' + di // modified name
    allIDs.push(d.id);
  });

  // map.properties = { ids: allIDs };
  console.log("All IDs: ", JSON.stringify(allIDs));

  // write it out
  fs.writeFile("PAK_adm3_mod.json", JSON.stringify(map), function(err) {
    if (err) return console.log(err);
  });
});