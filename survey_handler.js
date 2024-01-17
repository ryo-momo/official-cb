const { Question, SingleChoiceQuestion, MultipleChoiceQuestion } = require('./Question');

// Find the survey with title "basic_info"
const basicInfoSurvey = surveyContent.surveys.find(survey => survey.title === "basic_info");

// Map each question to a Question class instance
const questionObjects = basicInfoSurvey.questions.map(question => {
    return new Question(
        question.id,
        question.text,
        question.type,
        question.options,
        question.next,
        question.design
    );
});

console.log(questionObjects);