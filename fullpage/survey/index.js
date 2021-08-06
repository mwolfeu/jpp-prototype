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
let qs = {
  Main:await d3.csv(dataPath + "Main.csv", csvCleaner),
  Incident:await d3.csv(dataPath + "Incident.csv", csvCleaner),
  Perpetrator:await d3.csv(dataPath + "Perpetrator.csv", csvCleaner), 
}

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

addItems("Main", json.pages);

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
d3.selectAll('.sv-title-actions__title > span').each(function(){
	let str = d3.select(this).text()

	if (str.includes('panelIndex'))
	  d3.select(this).text(str.replace("{panelIndex}", "0"))
})

