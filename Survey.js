const { Question } = require('./Question');

class Survey {
    constructor(title, questions) {
        this.title = title;
        this.questions = questions
    }

    getCurrentQuestion(step_id) {
        question = this.questions.find(survey => survey.title === step_id);
        return new Question(question.id,
            question.text,
            question.type,
            question.next,
            question.options || [],
            question.choices_allowed || null);
    }
}