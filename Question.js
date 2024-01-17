const fs = require('fs');
const surveyContent = JSON.parse(fs.readFileSync('./survey_content.json', 'utf8'));

class Question {
    constructor(id, text, type, next) {
        this.id = id;
        this.text = text;
        this.type = type;
        this.next = next;
    }
}

class SingleChoiceQuestion extends Question{
    constructor(id, text, type, options, next) {
        super(id, text, type, next);
        this.options = options;
    }
}

class MultipleChoiceQuestion extends Question{
    constructor(id, type, choices_allowed, options, next) {
        super(id, type, next);
        this.choices_allowed = choices_allowed;
        this.options = options;
    }
}

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