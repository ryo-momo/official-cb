const AWS = require('aws-sdk');
const fs = require('fs');


function surveyHandler(user, answer_text) {
    switch (user.current_survey_id) {
        case "basic_info":
            user = basicInfoSurveyHandler(user, answer_text);
        default:
            console.log(`Unknown survey ID: ${user.current_survey_id}`);
    }
    return user;
}

//Validates the answer, stores the answer to DB and returns the modified User instance
function basicInfoSurveyHandler(user, answer_text) {
    if (user.isInInitialStep()) {
        user.current_survey_id = "basic_info";
        user.current_question = user.getCurrentSurvey().questions[0];
        return user;
    } else {
        //Validate and format the answer
        validation_result = basicInfoValidator(user, answer_text)
        if (validation_result.isValid) {
            user = validation_result.user_object;
            answer_text = validation_result.answer_text_revised;

            switch(user.current_question.type){
                case "text":
                    process_result = handleTextQuestion(user, answer_text);
                    break;
                case "single-choice":
                    process_result = handleSingleChoiceQuestion(user, answer_text);
                    break;
                case "multiple-choice":
                    process_result = handleMultipleChoiceQuestion(user, answer_text);
                    break;
            }

            if(process_result.storeValueToDB){
                //TODO: store the answer to DB
            }

            return user;
        } else {
            //If the answer is illegal, return the error message
            return basicInfoValidator(user, answer_text).user_object;
        }
    }
}

console.log(questionObjects);