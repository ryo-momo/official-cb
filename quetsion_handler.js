function handleTextQuestion(user, answer_text) {
    return {
        user_object: user,
        storeValueToDB: true
    };
}

function handleSingleChoiceQuestion(user, answer_text) {
    return {
        user_object: user,
        storeValueToDB: true
    };
}

function handleMultipleChoiceQuestion(user, answer_text) {
    //add the answer to the current answer array
    user.current_question.answers.push(answer_text);
    //delete the selected option from the current option array
    user.current_question.options = user.current_question.options.filter(option => option.text !== answer_text);


    const answers_to_go = user.current_question.answers_allowed - user.current_question.answers.length;
    const answers_in_text = user.current_question.answers.join('\n');

    //if the number of the answers reach the maximum, store those to DB
    //if not, have the user select another answer
    if (answers_to_go === 0) {
        return {
            user_object: user,
            storeValueToDB: true
        };
    }else if(answers_to_go > 0){
        user.current_question.text = `${user.current_question.text}\n\n残り選択数：${answers_to_go}個\n既に選んだもの：\n${answers_in_text}`;
        return {
            user_object: user,
            storeValueToDB: false
        };
    }else{
        throw new Error("ERROR: answers_to_go has gone less than zero");
    }
}

module.exports = {
    handleTextQuestion,
    handleSingleChoiceQuestion,
    handleMultipleChoiceQuestion
}

