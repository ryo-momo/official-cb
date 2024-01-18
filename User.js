const fs = require('fs');

class User {
    constructor(user_property) {
        this.user_id = user_property.user_id;
        this.major_state_id = user_property.user_state.major_state_id;
        this.minor_state_id = user_property.user_state.minor_state_id;
        this.current_action_id = user_property.user_state.current_action_id;
        this.current_step_id = user_property.user_state.current_step_id;
        this.current_question = user_property.user_state.current_question;
    }

    //Returns the user's current survey in progress
    getCurrentSurvey(){
        try {
            const surveys = JSON.parse(fs.readFileSync('./survey_content.json', 'utf8'));
            const actions = JSON.parse(fs.readFileSync('./user_states.json','utf-8')).actions;
            return surveys.find(survey => survey.title ===
                actions.find(action => this.current_action_id === action.action_id).survey_title);
        } catch (error) {
            console.error('エラーが発生しました:', error);
            return null;
        }
    }
}

module.exports = User;
