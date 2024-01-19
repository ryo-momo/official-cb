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
    user.current_question.answers.push(answer_text);
    const answers_to_go = user.current_question.answers_allowed - user.current_question.answers.length;
    const answers_in_text = user.current_question.answers.join('\n');

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
        console.log("ERROR: answers_to_go is less than zero");
    }
}