const Question = require('./Question');
const AWS = require('aws-sdk');
const fs = require('fs');
const surveyContent = JSON.parse(fs.readFileSync('./survey_content.json', 'utf8'));


function surveyHandler(action_id) {
    pass
}

function basicInfoSurveyHandler(text, step_id) {
    // Find the survey with title "basic_info"
    const basicInfoSurvey = Survey(surveyContent.surveys.find(survey => survey.title === "basic_info"));

}

function initialQuestionHandler() {
    pass
}



console.log(questionObjects);