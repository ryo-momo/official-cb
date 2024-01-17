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

module.exports = {
    Question,
    SingleChoiceQuestion,
    MultipleChoiceQuestion
};

