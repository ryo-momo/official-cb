const fs = require('fs');

class User {
    constructor(user_property) {
        this.user_id = user_property.user_id;
        this.major_state_id = user_property.user_state.major_state_id;
        this.minor_state_id = user_property.user_state.minor_state_id;
        this.current_action_id = user_property.user_state.current_action_id;
        this.current_survey_id = user_property.user_state.current_survey_id;
        this.current_step_id = user_property.user_state.current_step_id;
        this.current_question = user_property.user_state.current_question;
    }

    isInInitialStep(){
        if(this.current_step_id == null){
            return true;
        }else{
            return false;
        }
    }

    ///returns the user's current minor state object
    getCurrentMinorState(){
        user_states = JSON.parse(fs.readFileSync('./user_states.json', 'utf8'));
        minor_states = user_states.major_states.find(major_state => major_state.state_id === this.major_state_id).mimor_states
        return minor_states.find(minor_state => minor_state.state_id === this.minor_state_id);
    }

    getCurrentStep(){
        actions = JSON.parse(fs.readFileSync('./user_states.json', 'utf8')).actions;
        steps = actions.find(action => action.action_id === this.current_action_id).steps;
        return steps.find(step => step.step_id === this.current_step_id);
    }

    //Returns the user's current survey in progress
    getCurrentSurvey(){
        try {
            const surveys = JSON.parse(fs.readFileSync('./survey_content.json', 'utf8'));
            return surveys.find(survey => survey.title === this.current_survey_id);
        } catch (error) {
            console.error('エラーが発生しました:', error);
            return null;
        }
    }
}

module.exports = User;
