class Question {
    constructor(id, text, type, next, options, choices_allowed) {
        this.id = id;
        this.text = text;
        this.type = type;
        this.next = next;
        this.options = options;
        this.choices_allowed = choices_allowed;
    }
}

module.exports = {
    Question
};

