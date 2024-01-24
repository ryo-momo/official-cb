const user_states = require('./data/user_states')
const surveys = require('./data/survey_content')

class User {
    /**
     * Constructs a new User object.
     * @param {object} user_property - The properties of the user.
     */
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

    /**
     * Checks if the user is in the initial step.
     * @returns {boolean} True if the user is in the initial step, false otherwise.
     */
    isInInitialStep(){
        return this.current_step_id == null;
    }

    /**
     * Returns the user's current major state object.
     * @throws {Error} If the major state with the current major state id is not found.
     * @returns {object} The current major state object if found, null otherwise.
     */
    getCurrentMajorState(){
        const majorState = user_states.major_states.find(major_state => major_state.state_id === this.major_state_id);
        if (!majorState) {
            throw new Error(`Major state with id ${this.major_state_id} not found`);
        }
        return majorState;
    }

    /**
     * Returns the user's current minor state object.
     * @throws {Error} If the major state with the current major state id or the minor state with the current minor state id is not found.
     * @returns {object} The current minor state object if found, null otherwise.
     */
    getCurrentMinorState(){
        const majorState = user_states.major_states.find(major_state => major_state.state_id === this.major_state_id);
        if (!majorState) {
            throw new Error(`Major state with id ${this.major_state_id} not found`);
        }
        const minorState = majorState.minor_states.find(minor_state => minor_state.state_id === this.minor_state_id);
        if (!minorState) {
            throw new Error(`Minor state with id ${this.minor_state_id} not found`);
        }
        return minorState;
    }

    /**
     * Returns the user's current action object.
     * @throws {Error} If the action with the current action id is not found.
     * @returns {object} The current action object if found, null otherwise.
     */
    getCurrentAction(){
        const action = user_states.actions.find(action => action.action_id === this.current_action_id);
        if (!action) {
            throw new Error(`Action with id ${this.current_action_id} not found`);
        }
        return action;
    }

    /**
     * Returns the user's current step object.
     * @throws {Error} If the action with the current action id or the step with the current step id is not found.
     * @returns {object} The current step object if found, null otherwise.
     */
    getCurrentStep(){
        const action = user_states.actions.find(action => action.action_id === this.current_action_id);
        if (!action) {
            throw new Error(`Action with id ${this.current_action_id} not found`);
        }
        const step = action.steps.find(step => step.step_id === this.current_step_id);
        if (!step) {
            throw new Error(`Step with id ${this.current_step_id} not found`);
        }
        return step;
    }

    /**
     * Returns the user's current survey in progress.
     * @throws {Error} If the survey with the current survey id is not found.
     * @returns {object} The current survey object if found, null otherwise.
     */
    getCurrentSurvey(){
        const survey = surveys.surveys.find(survey => survey.id === this.current_survey_id);
        if (!survey) {
            throw new Error(`Survey with id ${this.current_survey_id} not found`);
        }
        return survey;
    }
}

module.exports = User;
