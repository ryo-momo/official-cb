class Question {
    constructor(id, text, next) {
        this.id = id;
        this.text = text;
        this.next = next;
    }
}

class TextQuestion extends Question{
    constructor(id, text, next){
        super(id, text, next);
        this.type = "text";
    }
}

class SingleChoiceQuestion extends Question{
    constructor(id, text, next, options){
        super(id, text, next);
        this.type = "single-choice";
        this.options = options;
    }
}


module.exports = {
    Question
};

