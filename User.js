const user_states = require('./data/user_states')
const surveys = require('./data/survey_content')

class User {
    constructor(user_property) {
        this.user_id = user_property.user_id || null;
        this.user_line_id = user_property.user_line_id;
        this.major_state_id = user_property.major_state_id || null;
        this.minor_state_id = user_property.minor_state_id || null;
        this.current_action_id = user_property.current_action_id || null;
        this.current_survey_id = user_property.current_survey_id || null;
        this.current_step_id = user_property.current_step_id || null;
        this.current_question = user_property.current_question || null;
    }

    isInInitialStep(){
        if(this.current_step_id == null){
            return true;
        }else{
            return false;
        }
    }

    ///returns the user's current major state object
    getCurrentMajorState(){
        return user_states.major_states.find(major_state => major_state.state_id === this.major_state_id);
    }

    ///returns the user's current minor state object
    getCurrentMinorState(){
        let minor_states = user_states.major_states.find(major_state => major_state.state_id === this.major_state_id).minor_states;
        return minor_states.find(minor_state => minor_state.state_id === this.minor_state_id);
    }

    getCurrentAction(){
        return user_states.actions.find(action => action.action_id === this.current_action_id);
    }

    ///returns the user's current step object
    getCurrentStep(){
        let steps = user_states.actions.find(action => action.action_id === this.current_action_id).steps;
        return steps.find(step => step.step_id === this.current_step_id);
    }

    //Returns the user's current survey in progress
    getCurrentSurvey(){
        try {
            return surveys.surveys.find(survey => survey.id === this.current_survey_id);
        } catch (error) {
            console.error('エラーが発生しました:', error);
            return null;
        }
    }
}

module.exports = User;
