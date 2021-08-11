< !DOCTYPE html >
    <
    html lang = "en" >

    <
    head >
    <
    title > Survey Chooser < /title> <
    meta name = "viewport"
content = "width=device-width" / >
    <
    script src = "https://unpkg.com/knockout@3.5.1/build/output/knockout-latest.js" > < /script> <
    script src = "https://unpkg.com/survey-knockout@1.8.58/survey.ko.min.js" > < /script> <
    link href = "https://unpkg.com/survey-core@1.8.58/modern.min.css"
type = "text/css"
rel = "stylesheet" / >

    <
    link rel = "stylesheet"
href = "./css/survey.css" >
    <
    /head>

<!-- <script src="https://ajax.googleapis.com/ajax/libs/d3js/6.7.0/d3.min.js"></script> -->

<
body >
    <
    div id = "surveyElement"
style = "display:inline-block;width:100%;" > < /div> <
    div id = "surveyResult" > < /div> <
    script type = "module"
src = "../js/survey.js" > < /script> <
    script >
    let survey = new SurveyUtil();
survey.survey(); <
/script> <
/body>

<
/html>