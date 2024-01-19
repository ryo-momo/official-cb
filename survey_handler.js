const AWS = require('aws-sdk');
const fs = require('fs');


function surveyHandler(user, answer_text) {
    switch (user.current_survey_id) {
        case "basic_info":
            user = basicInfoSurveyHandler(user, answer_text);
        default:
            console.log("Unknown survey ID: ${user.current_survey_id}");
    }
    return user
}

//Validates the answer, stores the answer to DB and returns the modified User instance
function basicInfoSurveyHandler(user, answer_text) {
    if (user.isInInitialStep()) {
        user.current_survey_id = "basic_info";
        user.current_question = user.getCurrentSurvey().questions[0];
        return user
    } else {
        //Validate the answer
        if (basicInfoValidator(user, answer_text).isValid) {
            switch(user.current_question.type){
                case "text":
                    user = handleTextQuestion(user, answer_text)
                    break;
                case "single-choice":
                    user = handleSingleChoiceQuestion(user, answer_text)
                    break;
                case "multiple-choice":
                    user = handleMultipleChoiceQuestion(user, answer_text)
                    break;
            }
            //change the user data to the next step
            user.goToTheNextStep();
            return user
        } else {
            //If the answer is illegal, return the error message
            return basicInfoValidator(user, answer_text).user_object;
        }
    }

}

function textQuestionHandler(question) {

}




console.log(questionObjects);