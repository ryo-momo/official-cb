"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultipleChoiceQuestion = exports.handleSingleChoiceQuestion = exports.handleTextQuestion = exports.handleQuestion = void 0;
const ERROR_MESSAGES = {
    NULL_OPTIONS: 'ERROR: current_question.options is null',
    NULL_QUESTION: 'ERROR: current_question is null',
    NEGATIVE_ANSWERS: 'ERROR: answers_to_go has gone less than zero',
};
const handleQuestion = (user, answer_text) => ({
    user_object: user,
    storeValueToDB: true,
    goToNextStep: true,
});
exports.handleQuestion = handleQuestion;
exports.handleTextQuestion = exports.handleQuestion;
exports.handleSingleChoiceQuestion = exports.handleQuestion;
const handleMultipleChoiceQuestion = (user, answer_text) => {
    const current_question = user.getCurrentQuestion();
    if (user.current_answers && current_question) {
        //add the answer to the current answer array
        user.current_answers.push(answer_text);
        if (current_question && 'choices_allowed' in current_question) {
            //delete the selected option from the current option array
            current_question.options = current_question.options.filter((option) => option.text !== answer_text);
        }
        else {
            throw new Error(ERROR_MESSAGES.NULL_OPTIONS);
        }
        const answers_to_go = current_question.choices_allowed - user.current_answers.length;
        const answers_in_text = user.current_answers.join('\n');
        //if the number of the answers reach the maximum, store those to DB
        //if not, have the user select another answer
        if (answers_to_go === 0) {
            return {
                user_object: user,
                storeValueToDB: true,
                goToNextStep: true,
            };
        }
        else if (answers_to_go > 0) {
            current_question.text = `${current_question.text}\n\n残り選択数：${answers_to_go}\n既に選んだもの：\n${answers_in_text}`;
            return {
                user_object: user,
                storeValueToDB: false,
                goToNextStep: false,
            };
        }
        else {
            throw new Error(ERROR_MESSAGES.NEGATIVE_ANSWERS);
        }
    }
    else {
        throw new Error(ERROR_MESSAGES.NULL_QUESTION);
    }
};
exports.handleMultipleChoiceQuestion = handleMultipleChoiceQuestion;
