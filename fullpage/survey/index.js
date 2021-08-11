Survey
    .StylesManager
    .applyTheme("modern");

var json = {
    title: "Torture Incident Survey.",
    "completedHtml": "<h3>Thank you for your submission.</h3> <h5>We would be happy to send you more information, hear about a case referral, or get you involved!!</h5>",
showProgressBar: "top",
    "pages": [],
    "showQuestionNumbers": "on"
};


let valPrep = {
  single:d=>{
	let vals = d.values.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).split(',').map(d=>`"${d}"`);
	return JSON.parse(`[${vals.join(',')}]`)
  },
  multiple:d=>{
	let vals = d.values.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).split(',').map(d=>`"${d}"`);
	return JSON.parse(`[${vals.join(',')}]`)
  }
}

let lang = "en";
function csvCleaner(d){
	    return {page:d[`Page-${lang}`], name: d.Name, input:d.Input, description:d[`Description-${lang}`], values:d[`Values-${lang}`], required:d.Required}
	}



let dataPath = "data/Web Project Data Dictionary - ";
/*
let qs = {
  Main:await d3.csv(dataPath + "Main.csv", csvCleaner),
  Incident:await d3.csv(dataPath + "Incident.csv", csvCleaner),
  Perpetrator:await d3.csv(dataPath + "Perpetrator.csv", csvCleaner), 
}
*/


function addPanelDynamic(elements, d) {
	let element =  {
                    "type": "paneldynamic",
                    "name": d.name,
				minPanelCount:1,
                    "title": d.description,
                    "renderMode": "list",
                    "templateTitle": `${d.values} #{panelIndex}`,
                    "templateElements": [],
                    "panelCount": 1,
                    "panelAddText": `Add New ${d.values}`,
                    "panelRemoveText": `Remove ${d.values}`
		}
	elements.push(element);
	return element.templateElements;
}

function addItems(fn, elements, indent) {
	if(!indent) indent = 0;
	let rows = qs[fn];

	rows.forEach(d => {
		let item;

		if(d.page != undefined && d.page.length) {
			let page = {
			    title:d.page,
			    "name": d.page,
			    "elements": []
			};
			json.pages.push(page);
			elements = page.elements;
		}

		if (d.input=='single' && d.name != 'constituency') {
			item = {
				type:"dropdown",
				name:d.name,
				title:d.description,
				optionsCaption: "Select...", // otherwise gets from localization
				colCount:0,
				choices:valPrep[d.input](d)
			}
			
		}

		if (d.input=='string') {
			item = {
				type:"text",
				name:d.name,
				title:d.description,
		    		pplaceHolder: "Type Here",
				colCount:0,
			}

		}

		if (d.input=='date') {
			item = {
				type:"text",
		    		inputType: "date",
				name:d.name,
				title:d.description,
		    		pplaceHolder: "Type Here",
				colCount:0,
			}

		}

		if (d.input=='multiple') {
			item = {
			    type: "checkbox",
				name:d.name,
				title:d.description,
			    hasNone: true,
			    colCount: 3,
			    choices: valPrep[d.input](d)
			}
		}

		if (item) {
			item.indent = indent;
			item.isRequired = d.required=="TRUE",
			//item.maxWidth = "800px";
			elements.push(item); 
		}
		if (d.input=='array') {
			let newElements = addPanelDynamic(elements, d);
			addItems(d.values, newElements, indent+1);
		}
	});	
}

//addItems("Main", json.pages);

//console.log(json)

var json = {
  "title": "Torture Incident Survey.",
  "completedHtml": "<h3>Thank you for your submission.</h3> <h5>We would be happy to send you more information, hear about a case referral, or get you involved!!</h5>",
  "showProgressBar": "top",
  "pages": [
    {
      "title": "Victim",
      "name": "Victim",
      "elements": [
        {
          "type": "text",
          "name": "first_name",
          "title": "First Name",
          "pplaceHolder": "Type Here",
          "colCount": 0,
          "indent": 0,
          "isRequired": true
        },
        {
          "type": "text",
          "name": "last_ame",
          "title": "Last Name",
          "pplaceHolder": "Type Here",
          "colCount": 0,
          "indent": 0,
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "gender",
          "title": "Gender",
          "optionsCaption": "Select...",
          "colCount": 0,
          "choices": [
            "Female",
            " Male",
            " Transgender"
          ],
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "dropdown",
          "name": "education",
          "title": "Education Level",
          "optionsCaption": "Select...",
          "colCount": 0,
          "choices": [
            "School1",
            " School2",
            " University",
            " None",
            " Other"
          ],
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "text",
          "name": "occupation",
          "title": "Occupation",
          "pplaceHolder": "Type Here",
          "colCount": 0,
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "dropdown",
          "name": "caste",
          "title": "Caste",
          "optionsCaption": "Select...",
          "colCount": 0,
          "choices": [
            "Butt",
            " Jutt",
            " Rajpoot",
            " Sheikh",
            " Mughal",
            " Gujjar",
            " Qureshi "
          ],
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "dropdown",
          "name": "religion",
          "title": "Religion",
          "optionsCaption": "Select...",
          "colCount": 0,
          "choices": [
            "Muslim",
            " Hindu",
            " Christian",
            " Ahmadiyya",
            " Sikh",
            " Other"
          ],
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "dropdown",
          "name": "ethnicity",
          "title": "Ethnicity",
          "optionsCaption": "Select...",
          "colCount": 0,
          "choices": [
            "Punjabi",
            " Pashtun",
            " Sindhi",
            " Saraiki",
            " Muhajir",
            " Baloch",
            " Other"
          ],
          "indent": 0,
          "isRequired": false
        }
      ]
    },
    {
      "title": "Incident",
      "name": "Incident",
      "elements": [
        {
          "type": "dropdown",
          "name": "hosp_med",
          "title": "Was hospitalization or medical care needed",
          "optionsCaption": "Select...",
          "colCount": 0,
          "choices": [
            "True",
            " False"
          ],
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "checkbox",
          "name": "reason",
          "title": "Reason for torture",
          "hasNone": true,
          "colCount": 3,
          "choices": [
            "Confession",
            " Information",
            " Recovery",
            " Others"
          ],
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "text",
          "name": "rep_name",
          "title": "Name of representative",
          "pplaceHolder": "Type Here",
          "colCount": 0,
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "dropdown",
          "name": "complaint_filed",
          "title": "Was a complaint filed",
          "optionsCaption": "Select...",
          "colCount": 0,
          "choices": [
            "True",
            " False"
          ],
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "text",
          "inputType": "date",
          "name": "complaint_date",
          "title": "When was a complaint filed",
          "pplaceHolder": "Type Here",
          "colCount": 0,
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "dropdown",
          "name": "mlc_conducted",
          "title": "Was an MLC conducted",
          "optionsCaption": "Select...",
          "colCount": 0,
          "choices": [
            "True",
            " False"
          ],
          "indent": 0,
          "isRequired": false
        },
        {
          "type": "dropdown",
          "name": "outcome",
          "title": "Outcome of the complaint",
          "optionsCaption": "Select...",
          "colCount": 0,
          "choices": [
            "Compromise",
            " Pending",
            " Perpetrator_punished",
            " Out_of_court_settlement"
          ],
          "indent": 0,
          "isRequired": false
        }
      ]
    },
    {
      "title": "Detail",
      "name": "Detail",
      "elements": [
        {
          "type": "paneldynamic",
          "name": "incidents",
          "minPanelCount": 1,
          "title": "Incident Descriptions",
          "renderMode": "list",
          "templateTitle": "Incident #{panelIndex}",
          "templateElements": [
            {
              "type": "text",
              "inputType": "date",
              "name": "date",
              "title": "Date of incident",
              "pplaceHolder": "Type Here",
              "colCount": 0,
              "indent": 1,
              "isRequired": false
            },
            {
              "type": "dropdown",
              "name": "incident_type",
              "title": "Type of incident",
              "optionsCaption": "Select...",
              "colCount": 0,
              "choices": [
                "Torture",
                " Custodial_death",
                " Custodial_rape"
              ],
              "indent": 1,
              "isRequired": false
            },
            {
              "type": "dropdown",
              "name": "place",
              "title": "place of occurence",
              "optionsCaption": "Select...",
              "colCount": 0,
              "choices": [
                "Police_lock_up",
                " Private_torture_cell",
                " Detention_centres",
                " Internment_camp",
                " Check_post",
                " Other"
              ],
              "indent": 1,
              "isRequired": false
            },
            {
              "type": "dropdown",
              "name": "during",
              "title": "What was happening at the time of the incident",
              "optionsCaption": "Select...",
              "colCount": 0,
              "choices": [
                "Arrest",
                " Interrogation",
                " Search_or_checking",
                " Other"
              ],
              "indent": 1,
              "isRequired": false
            },
            {
              "type": "checkbox",
              "name": "torture_type",
              "title": "Type of torture",
              "hasNone": true,
              "colCount": 3,
              "choices": [
                "Physical",
                " Psychological",
                " Cultural_humiliation",
                " Sexual_violence"
              ],
              "indent": 1,
              "isRequired": false
            },
            {
              "type": "checkbox",
              "name": "torture_methods",
              "title": "Method of Torture",
              "hasNone": true,
              "colCount": 3,
              "choices": [
                "Beating",
                " Cheera",
                " Chittar",
                " Danda",
                " Dolli",
                " Falaka",
                " Jack",
                " Manji",
                " Rolla",
                " Roller",
                " Strappado",
                " Sleep_deprivation",
                " Water_boarding",
                " Solitary_confinement",
                " Light_deprivation",
                " Sexual_violence",
                " Witnessing_other_people_being_tortured"
              ],
              "indent": 1,
              "isRequired": false
            },
            {
              "type": "paneldynamic",
              "name": "perpetrators",
              "minPanelCount": 1,
              "title": "Perpetrators Description",
              "renderMode": "list",
              "templateTitle": "Perpetrator #{panelIndex}",
              "templateElements": [
                {
                  "type": "dropdown",
                  "name": "force",
                  "title": "Law Inforcement Agency",
                  "optionsCaption": "Select...",
                  "colCount": 0,
                  "choices": [
                    "Counter_terrorism_department (CTD)",
                    "  Criminal_investigation_agency (CIA)",
                    " Punjab Elite Force",
                    " Punjab Traffic Police",
                    " Punjab Dolphin Force",
                    " Paramilitary Forces",
                    " Military"
                  ],
                  "indent": 2,
                  "isRequired": false
                },
                {
                  "type": "dropdown",
                  "name": "action",
                  "title": "Action taken against perpetrator",
                  "optionsCaption": "Select...",
                  "colCount": 0,
                  "choices": [
                    "Temporary Suspension",
                    " Permanent Suspension",
                    " Transfer",
                    " Demotion",
                    " Other"
                  ],
                  "indent": 2,
                  "isRequired": false
                },
                {
                  "type": "dropdown",
                  "name": "rank",
                  "title": "Rank of the perpetrator",
                  "optionsCaption": "Select...",
                  "colCount": 0,
                  "choices": [
                    "Constable",
                    " Head_constable",
                    " Assistant_sub_inspector",
                    " Sub_inspector_inspector",
                    " Assistant_superintendent_of_police",
                    " Deputy_superintendent_of_police",
                    " Supeintendent_of_police",
                    " Senior_superintendent/assistant_inspector_general_of_police",
                    " Deputy_inspector_general_of_police",
                    " Additional_inspector_general_of_police",
                    " Insepctor_general_of_police"
                  ],
                  "indent": 2,
                  "isRequired": false
                },
                {
                  "type": "text",
                  "name": "posting",
                  "title": "Police Station where posted",
                  "pplaceHolder": "Type Here",
                  "colCount": 0,
                  "indent": 2,
                  "isRequired": false
                },
                {
                  "type": "text",
                  "name": "superior",
                  "title": "Perpetrator's immediate superior",
                  "pplaceHolder": "Type Here",
                  "colCount": 0,
                  "indent": 2,
                  "isRequired": false
                }
              ],
              "panelCount": 1,
              "panelAddText": "Add New Perpetrator",
              "panelRemoveText": "Remove Perpetrator"
            }
          ],
          "panelCount": 1,
          "panelAddText": "Add New Incident",
          "panelRemoveText": "Remove Incident"
        }
      ]
    }
  ],
  "showQuestionNumbers": "on"
}

window.survey = new Survey.Model(json);


survey
    .onComplete
    .add(function (sender) {
        document
            .querySelector('#surveyResult')
            .textContent = "Result JSON:\n" + JSON.stringify(sender.data, null, 3);
    });

survey.render("surveyElement");

// fix numbering bug
/*
d3.selectAll('.sv-title-actions__title > span').each(function(){
	let str = d3.select(this).text()

	if (str.includes('panelIndex'))
	  d3.select(this).text(str.replace("{panelIndex}", "0"))
}) */

