const { Question, SingleChoiceQuestion, MultipleChoiceQuestion } = require('./Question');
const fs = require('fs');
const surveyContent = JSON.parse(fs.readFileSync('./survey_content.json', 'utf8'));


function surveyHandler(action_id) {

}

function basicInfoSurveyHandler(text, step_id) {
    // Find the survey with title "basic_info"
    const basicInfoSurvey = surveyContent.surveys.find(survey => survey.title === "basic_info");

    // Map each question to a Question class instance
    const questionObjects = basicInfoSurvey.questions.map(question => {
        switch (question.type) {
            case 'text':
                return new Question(question.id, question.text, question.type, question.next);
            case 'single-choice':
                return new SingleChoiceQuestion(question.id, question.text, question.type, question.options, question.next);
            case 'multiple-choice':
                return new MultipleChoiceQuestion(question.id, question.text, question.type, question.choices_allowed, question.options, question.next);
            default:
                throw new Error(`Unknown question type: ${question.type}`);
        }
    });
}

function initialQuestionHandler() {
    
}

function getCurrentQuestion(step_id) {
    const basicInfoSurvey = surveyContent.surveys.find(survey => survey.title === "basic_info");

    return basicInfoSurvey
}


console.log(questionObjects);