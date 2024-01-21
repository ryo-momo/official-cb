// const AWS = require('aws-sdk');
// const fs = require('fs');
const DatabaseCommunicator = require('./DatabaseCommunicator');
const db_data = require('./data/config');


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

            //if question handler returns to store the data, then store the answer data to DB
            if(process_result.storeValueToDB){
                dbc = new DatabaseCommunicator(db_data)
                dbc.connect()
                if(dbc.userExists(user)){
                    dbc.updateUserColumn(user.user_id, user.current_question.related_column, answer_text)
                    .then(() => console.log('Update successful'))
                    .catch(err => console.error(err))
                    .finally(() => dbc.disconnect());
                }
                dbc.disconnect()
            }

            return user;

        } else {
            //If the answer is illegal, return the error message
            return basicInfoValidator(user, answer_text).user_object;
        }
    }
}

console.log(questionObjects);