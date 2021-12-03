import SurveyUtil from "./survey.js"

// AWS IAM XMLHTTPREQ
let url = 'https://4z4ntfa3oi.execute-api.us-east-1.amazonaws.com/dev/v1/incident';
let lang = navigator.language.endsWith('-UR') ? 'ur' : 'en';

// GET SECRET KEYS
function getKeys() {
  let accessKeyId = $('#iam-id').val()
  let secretAccessKey = $('#iam-secret').val()
  if (accessKeyId == '' || secretAccessKey == '')
    return false
  return { accessKeyId, secretAccessKey }
}

// XMLHTTPREQUEST w UI Reporting on error
async function uiFetch(cfg) {

  let keys = getKeys();
  if (!keys) {
    if (!cfg.quietUI)
      errModal("USER HAS BLANK KEYS", "IAM User or Secret is empty.")
    cfg.rvFcn();
    return;
  }

  function errModal(admMsg, usrMsg) {
    var errorModal = new bootstrap.Modal(document.getElementById('error-modal')); // ERROR MODAL
    console.error(admMsg);
    $('#error-modal #error-status').html(usrMsg);
    errorModal.show();
    cfg.rvFcn();
  }

  try {
    const aws = new aws4fetch.AwsClient({...keys, ...cfg, retries: 3 });
    const response = await aws.fetch(cfg.url, { method: cfg.method, body: JSON.stringify(cfg.body) })
    console.log(response);
    if (response.status >= 200 && response.status <= 205) {
      if (response.status == 200 && !('method' in cfg)) {
        cfg.rvFcn(await response.json());
      } else {
        cfg.rvFcn();
      }
    } else {
      errModal('AWS Fetch ERROR:' + response, response.status);
      cfg.rvFcn();
    }
  } catch (error) {
    errModal('AWS Fetch CORS ERROR', 'Cross-Origin Error');
    cfg.rvFcn();
  }
}

// SETUP MODAL
$('#login-button').click(login)
$('#login').submit(function(event) { event.preventDefault(); });
let loginData = ['iam-id', 'iam-secret'];
loginData.forEach(d => {
  $('#' + d).val((history.state || {})[d] || '')
});

function login() {
  let accessKeyId = $('#iam-id').val()
  let secretAccessKey = $('#iam-secret').val()
    // history.pushState({ 'iam-id': accessKeyId, 'iam-secret': secretAccessKey }, '') // use if pwd save fails
  history.pushState({}, ''); // on Chrome this triggers pwd save
}


// AWS SUBMIT
let surveyOp;

function awsCall(obj) {
  let data = obj.getAllValues();

  let awsCfg;
  if (surveyOp == 'create') {
    awsCfg = {
      method: 'POST',
      body: {
        data,
        lang
      },
      rvFcn: d => {
        console.log("ROW CREATE", data, d);
        $table.bootstrapTable('refresh');
      },
      url
    };
  }
  if (surveyOp == 'update') {
    let pk = $table.bootstrapTable('getSelections')[0].pk; // partition key;
    data.pk = pk;
    // handler: get pk entry, compare, write new
    // awsCfg = {
    //   method: 'PUT',
    //   body: {
    //     data,
    //     lang
    //   },
    //   rvFcn: d => {
    //     console.log("ROW PUT (update)", data, d);
    //     $table.bootstrapTable('refresh');
    //   },
    //   url: url + '/' + pk
    // };
    awsCfg = {
      method: 'POST',
      body: {
        data,
        lang
      },
      rvFcn: d => {
        console.log("ROW REPLACE", data, d);
        $table.bootstrapTable('refresh');
      },
      url
    };
  }
  uiFetch(awsCfg)
}

// SURVEY
let surveyCfg = {
  title: "Torture Incident Survey.",
  completedHtml: "<h3>Survey Submitted</h3>",
  onComplete: awsCall,
  onAfterRenderQuestionInput: (d, e) => {
    if (e.question.name == "date" && e.question.value == undefined) // surveyjs bug fix: fails to use default value
      e.question.value = "1970-01-01";
  },
  lang,
  isIntake: false
};
let survey = new SurveyUtil();
survey.init(surveyCfg);
var surveyModal = new bootstrap.Modal(document.getElementById('survey-modal'));

// $(function() {
//   $('form').submit(function() {
//     alert($(this).serialize())
//     return false
//   })
// })

// TOOLBAR BUTTONS
window.buttons = function() {
  return {
    btnNewRow: {
      text: 'New Row',
      icon: 'fa fa-user-plus',
      event: (function() {
        surveyOp = 'create';
        survey.clear();
        surveyModal.show();
      }).bind(this),
      attributes: {
        title: 'Create a new row'
      }
    },
    btnEditRow: {
      text: 'Edit Row',
      icon: 'fas fa-user-edit',
      event: (function() {
        surveyOp = 'update';
        let body = $table.bootstrapTable('getSelections')[0];
        if (!body) return;

        // open survey
        survey.clear();
        survey.surveyObj.mergeData(body);
        surveyModal.show();
      }).bind(this),
      attributes: {
        title: 'Edit selected row'
      }
    },
    btnDeleteRow: {
      text: 'Delete Row',
      icon: 'fas fa-user-minus',
      event: function() {
        let pk = $table.bootstrapTable('getSelections')[0].pk; // partition key;
        let opts = {
          rvFcn: d => {
            console.log("ROW DELETE", pk, d);
            $table.bootstrapTable('refresh');
          },
          method: 'DELETE',
          url: url + '/' + pk
        };
        uiFetch(opts);
      },
      attributes: {
        title: 'Delete selected row'
      }
    },
    btnUpdate: {
      text: 'Update the aggregate',
      icon: 'bi bi-box-arrow-in-up',
      event: function() {
        alert('Do some stuff to e.g. search all users which has logged in the last week')
      },
      attributes: {
        title: 'Update the aggregate website values'
      }
    },
    btnView: {
      text: 'View changes',
      icon: 'fas fa-eye',
      event: function() {
        let rv = testRv;
        let data = JSON.stringify(rv); // DUMMY TEST
        let viewURL = `${window.location.protocol}//${window.location.host}/jpp-prototype/frontend/?vis-data=${data}`;
        console.log("Viewing:", rv);
        window.open(encodeURI(viewURL), '_blank');
      },
      attributes: {
        title: 'View aggregate visualization before updating'
      }
    }
  }
}

// INIT TABLE
var $table = $('#table')
let colNames = survey.getLayout().Main.map(d => { return { name: d.Name } });

$('#table tr').append('<th data-radio="true" data-force-hide="true" ></th>');
colNames.forEach(d => $('#table tr').append(`<th data-field="${d.name}" data-sortable="true" data-filter-control="input">${d.name}</th>`));
$('[data-field="incidents"]')
  .attr("data-formatter", "JSON.stringify")
  .attr("data-visible", "false")
  .attr("data-tableexport-display", "always");
// .attr("data-width", "1000").attr("data-width-unit", "px");


$(function() {
  $table.bootstrapTable({
    // exportHiddenCells: true,
    // exportDataType: "all",
    exportTypes: ['json', 'csv'],
    exportOptions: {
      exportHiddenCells: true,
      onTableExportBegin: d => $table.bootstrapTable('showColumn', 'incidents'),
      onTableExportEnd: d => $table.bootstrapTable('hideColumn', 'incidents'),
    },
    // data: incidents
    responseHandler: function(res) {
      return res.Items
    }
  })
})

// DISABLE BUTTONS IF NO SELECTION
// data-events="operateEvent" on the column is broken (disables getselections)
// poll instead.
let pollButtons;
setInterval(function() {
  let checked = $('[name="btSelectItem"]:checked').val() == 'on';
  if (!pollButtons) pollButtons = $('[name="btnEditRow"], [name="btnDeleteRow"]');
  if (checked)
    pollButtons.removeClass('disabled');
  else
    pollButtons.addClass('disabled');
}, 500);

// SYNC (scan) request
let firstLoad = true;
window.ajaxRequest = function(params) {
  let cfg = {
    url,
    quietUI: firstLoad, // no errors on start
    rvFcn: d => params.success(d || { Items: [] }),
  };
  firstLoad = false;
  uiFetch(cfg);
}


// for VIEW
let testRv = {
  "Northern Areas~Northern Areas": {
    "gender": {
      "female": 3,
      "male": 2,
      "transgender": 0
    },
    "region": {
      "Northern Areas": 5
    }
  },
  "Azad Kashmir~Azad Kashmir": {
    "gender": {
      "female": 5,
      "male": 9,
      "transgender": 4
    },
    "region": {
      "Azad Kashmir": 18
    }
  },
  "Khyber Pakhtunkhawa~Abbottabad": {
    "gender": {
      "female": 6,
      "male": 1,
      "transgender": 8
    },
    "region": {
      "Khyber Pakhtunkhawa": 15
    }
  },
  "Khyber Pakhtunkhawa~Bajur": {
    "gender": {
      "female": 5,
      "male": 10,
      "transgender": 4
    },
    "region": {
      "Khyber Pakhtunkhawa": 19
    }
  },
  "Khyber Pakhtunkhawa~Bannu": {
    "gender": {
      "female": 4,
      "male": 0,
      "transgender": 4
    },
    "region": {
      "Khyber Pakhtunkhawa": 8
    }
  },
  "Khyber Pakhtunkhawa~Batagram": {
    "gender": {
      "female": 3,
      "male": 9,
      "transgender": 1
    },
    "region": {
      "Khyber Pakhtunkhawa": 13
    }
  },
  "Khyber Pakhtunkhawa~Bunair": {
    "gender": {
      "female": 9,
      "male": 6,
      "transgender": 4
    },
    "region": {
      "Khyber Pakhtunkhawa": 19
    }
  },
  "Khyber Pakhtunkhawa~Charsada": {
    "gender": {
      "female": 9,
      "male": 7,
      "transgender": 8
    },
    "region": {
      "Khyber Pakhtunkhawa": 24
    }
  },
  "Khyber Pakhtunkhawa~Chitral": {
    "gender": {
      "female": 8,
      "male": 4,
      "transgender": 5
    },
    "region": {
      "Khyber Pakhtunkhawa": 17
    }
  },
  "Khyber Pakhtunkhawa~D. I. Khan": {
    "gender": {
      "female": 5,
      "male": 4,
      "transgender": 0
    }
  },
  "Khyber Pakhtunkhawa~Hangu": {
    "gender": {
      "female": 3,
      "male": 4,
      "transgender": 4
    },
    "region": {
      "Khyber Pakhtunkhawa": 11
    }
  },
  "Khyber Pakhtunkhawa~Haripur": {
    "gender": {
      "female": 8,
      "male": 7,
      "transgender": 2
    },
    "region": {
      "Khyber Pakhtunkhawa": 17
    }
  },
  "Khyber Pakhtunkhawa~Karak": {
    "gender": {
      "female": 6,
      "male": 3,
      "transgender": 2
    },
    "region": {
      "Khyber Pakhtunkhawa": 11
    }
  },
  "Khyber Pakhtunkhawa~Khyber": {
    "gender": {
      "female": 1,
      "male": 3,
      "transgender": 1
    },
    "region": {
      "Khyber Pakhtunkhawa": 5
    }
  },
  "Khyber Pakhtunkhawa~Kohat": {
    "gender": {
      "female": 8,
      "male": 0,
      "transgender": 3
    },
    "region": {
      "Khyber Pakhtunkhawa": 11
    }
  },
  "Khyber Pakhtunkhawa~Kohistan": {
    "gender": {
      "female": 8,
      "male": 6,
      "transgender": 4
    },
    "region": {
      "Khyber Pakhtunkhawa": 18
    }
  },
  "Khyber Pakhtunkhawa~Kurram": {
    "gender": {
      "female": 10,
      "male": 7,
      "transgender": 9
    },
    "region": {
      "Khyber Pakhtunkhawa": 26
    }
  },
  "Khyber Pakhtunkhawa~Lakki Marwat": {
    "gender": {
      "female": 7,
      "male": 4,
      "transgender": 9
    },
    "region": {
      "Khyber Pakhtunkhawa": 20
    }
  },
  "Khyber Pakhtunkhawa~Lower Dir": {
    "gender": {
      "female": 9,
      "male": 10,
      "transgender": 3
    },
    "region": {
      "Khyber Pakhtunkhawa": 22
    }
  },
  "Khyber Pakhtunkhawa~Malakand": {
    "gender": {
      "female": 9,
      "male": 2,
      "transgender": 9
    },
    "region": {
      "Khyber Pakhtunkhawa": 20
    }
  },
  "Khyber Pakhtunkhawa~Mansehra": {
    "gender": {
      "female": 9,
      "male": 10,
      "transgender": 3
    },
    "region": {
      "Khyber Pakhtunkhawa": 22
    }
  },
  "Khyber Pakhtunkhawa~Mardan": {
    "gender": {
      "female": 5,
      "male": 5,
      "transgender": 5
    },
    "region": {
      "Khyber Pakhtunkhawa": 15
    }
  },
  "Khyber Pakhtunkhawa~Mohmand": {
    "gender": {
      "female": 2,
      "male": 1,
      "transgender": 5
    },
    "region": {
      "Khyber Pakhtunkhawa": 8
    }
  },
  "Khyber Pakhtunkhawa~North Waziristan": {
    "gender": {
      "female": 4,
      "male": 6,
      "transgender": 1
    },
    "region": {
      "Khyber Pakhtunkhawa": 11
    }
  },
  "Khyber Pakhtunkhawa~Nowshera": {
    "gender": {
      "female": 9,
      "male": 0,
      "transgender": 9
    },
    "region": {
      "Khyber Pakhtunkhawa": 18
    }
  },
  "Khyber Pakhtunkhawa~Orakzai": {
    "gender": {
      "female": 7,
      "male": 9,
      "transgender": 1
    },
    "region": {
      "Khyber Pakhtunkhawa": 17
    }
  },
  "Khyber Pakhtunkhawa~Peshawar": {
    "gender": {
      "female": 7,
      "male": 7,
      "transgender": 2
    },
    "region": {
      "Khyber Pakhtunkhawa": 16
    }
  },
  "Khyber Pakhtunkhawa~Shangla": {
    "gender": {
      "female": 4,
      "male": 9,
      "transgender": 8
    },
    "region": {
      "Khyber Pakhtunkhawa": 21
    }
  },
  "Khyber Pakhtunkhawa~South Waziristan": {
    "gender": {
      "female": 2,
      "male": 2,
      "transgender": 2
    },
    "region": {
      "Khyber Pakhtunkhawa": 6
    }
  },
  "Khyber Pakhtunkhawa~Swabi": {
    "gender": {
      "female": 10,
      "male": 4,
      "transgender": 2
    },
    "region": {
      "Khyber Pakhtunkhawa": 16
    }
  },
  "Khyber Pakhtunkhawa~Swat": {
    "gender": {
      "female": 9,
      "male": 2,
      "transgender": 2
    },
    "region": {
      "Khyber Pakhtunkhawa": 13
    }
  },
  "Khyber Pakhtunkhawa~Tank": {
    "gender": {
      "female": 4,
      "male": 3,
      "transgender": 6
    },
    "region": {
      "Khyber Pakhtunkhawa": 13
    }
  },
  "Khyber Pakhtunkhawa~Tor Garh": {
    "gender": {
      "female": 1,
      "male": 1,
      "transgender": 8
    },
    "region": {
      "Khyber Pakhtunkhawa": 10
    }
  },
  "Khyber Pakhtunkhawa~Upper Dir": {
    "gender": {
      "female": 8,
      "male": 5,
      "transgender": 3
    },
    "region": {
      "Khyber Pakhtunkhawa": 16
    }
  },
  "Punjab~Attock": {
    "gender": {
      "female": 5,
      "male": 1,
      "transgender": 10
    },
    "region": {
      "Punjab": 16
    }
  },
  "Punjab~Bahawalnagar": {
    "gender": {
      "female": 3,
      "male": 6,
      "transgender": 4
    },
    "region": {
      "Punjab": 13
    }
  },
  "Punjab~Bahawalpur": {
    "gender": {
      "female": 3,
      "male": 4,
      "transgender": 5
    },
    "region": {
      "Punjab": 12
    }
  },
  "Punjab~Bhakhar": {
    "gender": {
      "female": 2,
      "male": 10,
      "transgender": 9
    },
    "region": {
      "Punjab": 21
    }
  },
  "Punjab~Chakwal": {
    "gender": {
      "female": 3,
      "male": 4,
      "transgender": 8
    },
    "region": {
      "Punjab": 15
    }
  },
  "Punjab~Chiniot": {
    "gender": {
      "female": 5,
      "male": 2,
      "transgender": 5
    },
    "region": {
      "Punjab": 12
    }
  },
  "Punjab~D. G. Khan": {
    "gender": {
      "female": 2,
      "male": 5,
      "transgender": 7
    }
  },
  "Punjab~Faisalabad": {
    "gender": {
      "female": 9,
      "male": 5,
      "transgender": 10
    },
    "region": {
      "Punjab": 24
    }
  },
  "Punjab~Gujranwala": {
    "gender": {
      "female": 10,
      "male": 10,
      "transgender": 10
    },
    "region": {
      "Punjab": 30
    }
  },
  "Punjab~Gujrat": {
    "gender": {
      "female": 3,
      "male": 4,
      "transgender": 6
    },
    "region": {
      "Punjab": 13
    }
  },
  "Punjab~Hafizabad": {
    "gender": {
      "female": 3,
      "male": 3,
      "transgender": 1
    },
    "region": {
      "Punjab": 7
    }
  },
  "Punjab~Islamabad": {
    "gender": {
      "female": 1,
      "male": 4,
      "transgender": 5
    },
    "region": {
      "Punjab": 10
    }
  },
  "Punjab~Jehlum": {
    "gender": {
      "female": 9,
      "male": 2,
      "transgender": 2
    },
    "region": {
      "Punjab": 13
    }
  },
  "Punjab~Jhang": {
    "gender": {
      "female": 2,
      "male": 3,
      "transgender": 0
    },
    "region": {
      "Punjab": 5
    }
  },
  "Punjab~Kasur": {
    "gender": {
      "female": 8,
      "male": 2,
      "transgender": 3
    },
    "region": {
      "Punjab": 13
    }
  },
  "Punjab~Khanewal": {
    "gender": {
      "female": 5,
      "male": 7,
      "transgender": 5
    },
    "region": {
      "Punjab": 17
    }
  },
  "Punjab~Khushab": {
    "gender": {
      "female": 2,
      "male": 8,
      "transgender": 7
    },
    "region": {
      "Punjab": 17
    }
  },
  "Punjab~Lahore": {
    "gender": {
      "female": 0,
      "male": 7,
      "transgender": 7
    },
    "region": {
      "Punjab": 14
    }
  },
  "Punjab~Layyah": {
    "gender": {
      "female": 6,
      "male": 9,
      "transgender": 7
    },
    "region": {
      "Punjab": 22
    }
  },
  "Punjab~Lodhran": {
    "gender": {
      "female": 0,
      "male": 5,
      "transgender": 8
    },
    "region": {
      "Punjab": 13
    }
  },
  "Punjab~Mandi Bahauddin": {
    "gender": {
      "female": 10,
      "male": 9,
      "transgender": 7
    },
    "region": {
      "Punjab": 26
    }
  },
  "Punjab~Mianwali": {
    "gender": {
      "female": 4,
      "male": 5,
      "transgender": 1
    },
    "region": {
      "Punjab": 10
    }
  },
  "Punjab~Multan": {
    "gender": {
      "female": 2,
      "male": 6,
      "transgender": 6
    },
    "region": {
      "Punjab": 14
    }
  },
  "Punjab~Muzaffar Garh": {
    "gender": {
      "female": 2,
      "male": 5,
      "transgender": 2
    },
    "region": {
      "Punjab": 9
    }
  },
  "Punjab~Nankana Sahib": {
    "gender": {
      "female": 8,
      "male": 1,
      "transgender": 9
    },
    "region": {
      "Punjab": 18
    }
  },
  "Punjab~Narowal 226": {
    "gender": {
      "female": 4,
      "male": 3,
      "transgender": 3
    },
    "region": {
      "Punjab": 10
    }
  },
  "Punjab~Okara": {
    "gender": {
      "female": 7,
      "male": 7,
      "transgender": 4
    },
    "region": {
      "Punjab": 18
    }
  },
  "Punjab~Pakpattan": {
    "gender": {
      "female": 9,
      "male": 9,
      "transgender": 7
    },
    "region": {
      "Punjab": 25
    }
  },
  "Punjab~Rahim Yar Khan": {
    "gender": {
      "female": 5,
      "male": 5,
      "transgender": 1
    },
    "region": {
      "Punjab": 11
    }
  },
  "Punjab~Rajanpur": {
    "gender": {
      "female": 7,
      "male": 8,
      "transgender": 6
    },
    "region": {
      "Punjab": 21
    }
  },
  "Punjab~Rawalpindi": {
    "gender": {
      "female": 1,
      "male": 1,
      "transgender": 3
    },
    "region": {
      "Punjab": 5
    }
  },
  "Punjab~Sahiwal": {
    "gender": {
      "female": 1,
      "male": 2,
      "transgender": 9
    },
    "region": {
      "Punjab": 12
    }
  },
  "Punjab~Sargodha": {
    "gender": {
      "female": 7,
      "male": 9,
      "transgender": 1
    },
    "region": {
      "Punjab": 17
    }
  },
  "Punjab~Sheikhupura": {
    "gender": {
      "female": 1,
      "male": 1,
      "transgender": 5
    },
    "region": {
      "Punjab": 7
    }
  },
  "Punjab~Sialkot": {
    "gender": {
      "female": 3,
      "male": 3,
      "transgender": 8
    },
    "region": {
      "Punjab": 14
    }
  },
  "Punjab~T.T. Singh": {
    "gender": {
      "female": 4,
      "male": 7,
      "transgender": 10
    }
  },
  "Punjab~Vehari": {
    "gender": {
      "female": 10,
      "male": 7,
      "transgender": 5
    },
    "region": {
      "Punjab": 22
    }
  },
  "Sindh~Badin": {
    "gender": {
      "female": 8,
      "male": 9,
      "transgender": 5
    },
    "region": {
      "Sindh": 22
    }
  },
  "Sindh~Dadu": {
    "gender": {
      "female": 5,
      "male": 9,
      "transgender": 7
    },
    "region": {
      "Sindh": 21
    }
  },
  "Sindh~Ghotki": {
    "gender": {
      "female": 7,
      "male": 6,
      "transgender": 7
    },
    "region": {
      "Sindh": 20
    }
  },
  "Sindh~Hyderabad": {
    "gender": {
      "female": 1,
      "male": 9,
      "transgender": 5
    },
    "region": {
      "Sindh": 15
    }
  },
  "Sindh~Jacobabad": {
    "gender": {
      "female": 4,
      "male": 6,
      "transgender": 9
    },
    "region": {
      "Sindh": 19
    }
  },
  "Sindh~Jamshoro": {
    "gender": {
      "female": 6,
      "male": 5,
      "transgender": 1
    },
    "region": {
      "Sindh": 12
    }
  },
  "Sindh~Karachi Central": {
    "gender": {
      "female": 10,
      "male": 4,
      "transgender": 2
    },
    "region": {
      "Sindh": 16
    }
  },
  "Sindh~Karachi East": {
    "gender": {
      "female": 3,
      "male": 3,
      "transgender": 3
    },
    "region": {
      "Sindh": 9
    }
  },
  "Sindh~Karachi Malir": {
    "gender": {
      "female": 0,
      "male": 6,
      "transgender": 3
    },
    "region": {
      "Sindh": 9
    }
  },
  "Sindh~Karachi South": {
    "gender": {
      "female": 9,
      "male": 8,
      "transgender": 5
    },
    "region": {
      "Sindh": 22
    }
  },
  "Sindh~Karachi West": {
    "gender": {
      "female": 6,
      "male": 9,
      "transgender": 7
    },
    "region": {
      "Sindh": 22
    }
  },
  "Sindh~Kashmore": {
    "gender": {
      "female": 4,
      "male": 1,
      "transgender": 1
    },
    "region": {
      "Sindh": 6
    }
  },
  "Sindh~Khairpur": {
    "gender": {
      "female": 1,
      "male": 4,
      "transgender": 3
    },
    "region": {
      "Sindh": 8
    }
  },
  "Sindh~Korangi": {
    "gender": {
      "female": 4,
      "male": 2,
      "transgender": 1
    },
    "region": {
      "Sindh": 7
    }
  },
  "Sindh~Larkana": {
    "gender": {
      "female": 10,
      "male": 9,
      "transgender": 3
    },
    "region": {
      "Sindh": 22
    }
  },
  "Sindh~Matiari": {
    "gender": {
      "female": 2,
      "male": 10,
      "transgender": 2
    },
    "region": {
      "Sindh": 14
    }
  },
  "Sindh~Mir Pur Khas": {
    "gender": {
      "female": 7,
      "male": 10,
      "transgender": 1
    },
    "region": {
      "Sindh": 18
    }
  },
  "Sindh~Nowshero Feroze": {
    "gender": {
      "female": 5,
      "male": 1,
      "transgender": 2
    },
    "region": {
      "Sindh": 8
    }
  },
  "Sindh~Sanghar": {
    "gender": {
      "female": 6,
      "male": 0,
      "transgender": 6
    },
    "region": {
      "Sindh": 12
    }
  },
  "Sindh~Shahdadkot": {
    "gender": {
      "female": 2,
      "male": 7,
      "transgender": 5
    },
    "region": {
      "Sindh": 14
    }
  },
  "Sindh~Shaheed Banazir Abad": {
    "gender": {
      "female": 10,
      "male": 5,
      "transgender": 6
    },
    "region": {
      "Sindh": 21
    }
  },
  "Sindh~Shikarpur": {
    "gender": {
      "female": 7,
      "male": 4,
      "transgender": 7
    },
    "region": {
      "Sindh": 18
    }
  },
  "Sindh~Sujawal": {
    "gender": {
      "female": 1,
      "male": 6,
      "transgender": 2
    },
    "region": {
      "Sindh": 9
    }
  },
  "Sindh~Sukkur": {
    "gender": {
      "female": 10,
      "male": 9,
      "transgender": 6
    },
    "region": {
      "Sindh": 25
    }
  },
  "Sindh~Tando Allah Yar": {
    "gender": {
      "female": 0,
      "male": 9,
      "transgender": 6
    },
    "region": {
      "Sindh": 15
    }
  },
  "Sindh~Tando Muhammad Khan": {
    "gender": {
      "female": 2,
      "male": 1,
      "transgender": 4
    },
    "region": {
      "Sindh": 7
    }
  },
  "Sindh~Tharparkar": {
    "gender": {
      "female": 3,
      "male": 6,
      "transgender": 5
    },
    "region": {
      "Sindh": 14
    }
  },
  "Sindh~Thatta": {
    "gender": {
      "female": 7,
      "male": 3,
      "transgender": 2
    },
    "region": {
      "Sindh": 12
    }
  },
  "Sindh~Umer Kot": {
    "gender": {
      "female": 8,
      "male": 7,
      "transgender": 0
    },
    "region": {
      "Sindh": 15
    }
  },
  "Balochistan~Awaran": {
    "gender": {
      "female": 1,
      "male": 10,
      "transgender": 8
    },
    "region": {
      "Balochistan": 19
    }
  },
  "Balochistan~Barkhan": {
    "gender": {
      "female": 2,
      "male": 5,
      "transgender": 8
    },
    "region": {
      "Balochistan": 15
    }
  },
  "Balochistan~Chagai": {
    "gender": {
      "female": 3,
      "male": 3,
      "transgender": 1
    },
    "region": {
      "Balochistan": 7
    }
  },
  "Balochistan~Dera Bugti": {
    "gender": {
      "female": 6,
      "male": 8,
      "transgender": 6
    },
    "region": {
      "Balochistan": 20
    }
  },
  "Balochistan~Duki": {
    "gender": {
      "female": 0,
      "male": 2,
      "transgender": 3
    },
    "region": {
      "Balochistan": 5
    }
  },
  "Balochistan~Gwadar": {
    "gender": {
      "female": 5,
      "male": 4,
      "transgender": 2
    },
    "region": {
      "Balochistan": 11
    }
  },
  "Balochistan~Harnai": {
    "gender": {
      "female": 6,
      "male": 4,
      "transgender": 1
    },
    "region": {
      "Balochistan": 11
    }
  },
  "Balochistan~Jaffarabad": {
    "gender": {
      "female": 10,
      "male": 8,
      "transgender": 6
    },
    "region": {
      "Balochistan": 24
    }
  },
  "Balochistan~Jhal Magsi": {
    "gender": {
      "female": 8,
      "male": 3,
      "transgender": 8
    },
    "region": {
      "Balochistan": 19
    }
  },
  "Balochistan~Kachhi/Bolan": {
    "gender": {
      "female": 1,
      "male": 1,
      "transgender": 6
    },
    "region": {
      "Balochistan": 8
    }
  },
  "Balochistan~Kalat": {
    "gender": {
      "female": 3,
      "male": 7,
      "transgender": 4
    },
    "region": {
      "Balochistan": 14
    }
  },
  "Balochistan~Kech/Turbat": {
    "gender": {
      "female": 2,
      "male": 9,
      "transgender": 3
    },
    "region": {
      "Balochistan": 14
    }
  },
  "Balochistan~Kharan": {
    "gender": {
      "female": 1,
      "male": 3,
      "transgender": 2
    },
    "region": {
      "Balochistan": 6
    }
  },
  "Balochistan~Khuzdar": {
    "gender": {
      "female": 0,
      "male": 7,
      "transgender": 7
    },
    "region": {
      "Balochistan": 14
    }
  },
  "Balochistan~Kohlu": {
    "gender": {
      "female": 9,
      "male": 3,
      "transgender": 8
    },
    "region": {
      "Balochistan": 20
    }
  },
  "Balochistan~Lasbela": {
    "gender": {
      "female": 3,
      "male": 1,
      "transgender": 5
    },
    "region": {
      "Balochistan": 9
    }
  },
  "Balochistan~Loralai": {
    "gender": {
      "female": 10,
      "male": 9,
      "transgender": 2
    },
    "region": {
      "Balochistan": 21
    }
  },
  "Balochistan~Mastung": {
    "gender": {
      "female": 2,
      "male": 9,
      "transgender": 8
    },
    "region": {
      "Balochistan": 19
    }
  },
  "Balochistan~Musa Khel": {
    "gender": {
      "female": 10,
      "male": 8,
      "transgender": 9
    },
    "region": {
      "Balochistan": 27
    }
  },
  "Balochistan~Nasirabad/Tamboo": {
    "gender": {
      "female": 6,
      "male": 5,
      "transgender": 7
    },
    "region": {
      "Balochistan": 18
    }
  },
  "Balochistan~Nushki": {
    "gender": {
      "female": 7,
      "male": 8,
      "transgender": 6
    },
    "region": {
      "Balochistan": 21
    }
  },
  "Balochistan~Panjgoor": {
    "gender": {
      "female": 7,
      "male": 5,
      "transgender": 4
    },
    "region": {
      "Balochistan": 16
    }
  },
  "Balochistan~Pishin": {
    "gender": {
      "female": 4,
      "male": 6,
      "transgender": 6
    },
    "region": {
      "Balochistan": 16
    }
  },
  "Balochistan~Qilla Abdullah": {
    "gender": {
      "female": 9,
      "male": 6,
      "transgender": 9
    },
    "region": {
      "Balochistan": 24
    }
  },
  "Balochistan~Qilla Saifullah": {
    "gender": {
      "female": 7,
      "male": 1,
      "transgender": 7
    },
    "region": {
      "Balochistan": 15
    }
  },
  "Balochistan~Quetta": {
    "gender": {
      "female": 6,
      "male": 6,
      "transgender": 3
    },
    "region": {
      "Balochistan": 15
    }
  },
  "Balochistan~Shaheed Sikandar Abad": {
    "gender": {
      "female": 7,
      "male": 7,
      "transgender": 0
    },
    "region": {
      "Balochistan": 14
    }
  },
  "Balochistan~Sherani": {
    "gender": {
      "female": 10,
      "male": 8,
      "transgender": 0
    },
    "region": {
      "Balochistan": 18
    }
  },
  "Balochistan~Sibbi": {
    "gender": {
      "female": 7,
      "male": 5,
      "transgender": 8
    },
    "region": {
      "Balochistan": 20
    }
  },
  "Balochistan~Sohbatpur": {
    "gender": {
      "female": 7,
      "male": 1,
      "transgender": 7
    },
    "region": {
      "Balochistan": 15
    }
  },
  "Balochistan~Washuk": {
    "gender": {
      "female": 9,
      "male": 1,
      "transgender": 2
    },
    "region": {
      "Balochistan": 12
    }
  },
  "Balochistan~Zhob": {
    "gender": {
      "female": 3,
      "male": 10,
      "transgender": 5
    },
    "region": {
      "Balochistan": 18
    }
  },
  "Balochistan~Ziarat": {
    "gender": {
      "female": 9,
      "male": 1,
      "transgender": 6
    },
    "region": {
      "Balochistan": 16
    }
  },
  "pakistan": {
    "region": {
      "Northern Areas": 5,
      "Azad Kashmir": 18,
      "Khyber Pakhtunkhawa": 478,
      "Punjab": 526,
      "Sindh": 432,
      "Balochistan": 521
    },
    "total": {
      "value": 1980
    }
  },
  "Northern Areas": {
    "gender": {
      "female": 3,
      "male": 2,
      "transgender": 0
    }
  },
  "Azad Kashmir": {
    "gender": {
      "female": 5,
      "male": 9,
      "transgender": 4
    }
  },
  "Khyber Pakhtunkhawa": {
    "gender": {
      "female": 194,
      "male": 147,
      "transgender": 137
    }
  },
  "Punjab": {
    "gender": {
      "female": 160,
      "male": 177,
      "transgender": 189
    }
  },
  "Sindh": {
    "gender": {
      "female": 148,
      "male": 168,
      "transgender": 116
    }
  },
  "Balochistan": {
    "gender": {
      "female": 180,
      "male": 174,
      "transgender": 167
    }
  }
};