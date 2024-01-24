const DatabaseCommunicator = require('./DatabaseCommunicator');
const db_data = require('./data/config');
const { handleTextQuestion, handleSingleChoiceQuestion, handleMultipleChoiceQuestion } = require('./quetsion_handler');
const basicInfoValidator = require('./survey_validator');

// This function validates the user's answer, stores the answer to the database, and returns the modified User instance.
function basicInfoSurveyHandler(user, answer_text) {
    // If the user is in the initial step, set the current survey and question.
    if (user.isInInitialStep()) {
        console.log('User is in initial step. Setting current survey and question.'); // Log message
        user.current_survey_id = "basic_info";
        user.current_question = user.getCurrentSurvey().questions[0];
        return user;
    } else {
        // Validate the user's answer.
        let validation_result = basicInfoValidator(user, answer_text)
        if (validation_result.isValid) {
            console.log('Answer is valid.'); // Log message
            user = validation_result.user_object;
            answer_text = validation_result.answer_text_revised;

            // Process the answer based on the question type.
            let process_result;
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

            // If the answer needs to be stored in the database, connect to the database and update the user's information.
            if(process_result.storeValueToDB){
                console.log('Storing answer to database.'); // Log message
                let dbc = new DatabaseCommunicator(db_data)
                dbc.connect()
                if(dbc.userExists(user)){
                    dbc.updateUserColumn(user.user_id, user.current_question.related_column, answer_text)
                    .then(() => console.log('Update successful')) // Log message
                    .catch(err => {
                        console.error('Error updating user column: ', err); // Log error message
                        throw err; 
                    })
                    .finally(() => dbc.disconnect());
                } else {
                    dbc.disconnect();
                }
            }

            return user;

        } else {
            console.log('Answer is not valid. Returning user object from validator.'); // Log message
            return basicInfoValidator(user, answer_text).user_object;
        }
    }
}

module.exports = basicInfoSurveyHandler;
