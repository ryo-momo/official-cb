const { Question } = require('./Question');

class Survey {
    constructor(survey) {
        this.title = survey.title;
        this.questions = survey.questions;
    }
}