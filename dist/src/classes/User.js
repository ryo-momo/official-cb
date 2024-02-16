"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.db_references = void 0;
const user_states_1 = require("../data/user_states");
const survey_content_1 = require("../data/survey_content");
const config_1 = require("../data/config");
const users_columns = config_1.db_data.tables.users.columns;
exports.db_references = {
    user_id: users_columns.user_id,
    user_line_id: users_columns.user_line_id,
    major_state_id: users_columns.major_state_id,
    minor_state_id: users_columns.minor_state_id,
    current_action_id: users_columns.current_action_id,
    current_survey_id: users_columns.current_survey_id,
    current_step_id: users_columns.current_step_id,
    current_question_id: users_columns.current_question_id,
    current_answers: users_columns.current_answers,
};
class User {
    constructor(user_property, response) {
        this.user_id = user_property.user_id || null;
        this.user_line_id = user_property.user_line_id;
        this.major_state_id = user_property.major_state_id || null;
        this.minor_state_id = user_property.minor_state_id || null;
        this.current_action_id = user_property.current_action_id || null;
        this.current_survey_id = user_property.current_survey_id || null;
        this.current_step_id = user_property.current_step_id || null;
        this.current_question_id = user_property.current_question_id || null;
        this.current_answers = Array.isArray(user_property.current_answers)
            ? user_property.current_answers
            : user_property.current_answers
                ? [user_property.current_answers]
                : [];
        this.response = response || {
            shouldReply: false,
            reply_token: null,
            message: [],
        };
    }
    isInInitialStep() {
        return this.current_step_id == null;
    }
    getCurrentMajorState() {
        const major_state = user_states_1.user_states.major_states.find((major_state) => major_state.state_id === this.major_state_id);
        if (!major_state) {
            throw new Error(`Major state with id ${this.major_state_id} not found`);
        }
        return major_state;
    }
    getCurrentMinorState() {
        const major_state = user_states_1.user_states.major_states.find((major_state) => major_state.state_id === this.major_state_id);
        if (!major_state) {
            throw new Error(`Major state with id ${this.major_state_id} not found`);
        }
        const minor_state = major_state.minor_states.find((minor_state) => minor_state.state_id === this.minor_state_id);
        if (!minor_state) {
            throw new Error(`Minor state with id ${this.minor_state_id} not found`);
        }
        return minor_state;
    }
    getCurrentAction() {
        const action = user_states_1.user_states.actions.find((action) => action.action_id === this.current_action_id);
        if (!action) {
            throw new Error(`Action with id ${this.current_action_id} not found`);
        }
        return action;
    }
    getCurrentStep() {
        const action = user_states_1.user_states.actions.find((action) => action.action_id === this.current_action_id);
        // Check if action has a steps property and it is not undefined
        if (action) {
            if ('steps' in action) {
                const step = action.steps.find((step) => step.step_id === this.current_step_id);
                if (step) {
                    return step;
                }
                else {
                    throw new Error(`Step with id ${this.current_step_id} not found`);
                }
            }
            else {
                throw new Error(`Steps not found in action with id ${this.current_action_id}`);
            }
        }
        else {
            throw new Error(`Action with id ${this.current_action_id} not found`);
        }
    }
    getCurrentSurvey() {
        const survey = survey_content_1.survey_contents.surveys.find((survey) => survey.id === this.current_survey_id);
        if (!survey) {
            throw new Error(`Survey with id ${this.current_survey_id} not found`);
        }
        return survey;
    }
    /**
     * Get the current question based on the user's current_question_id
     * @returns {Question} The current question object
     */
    getCurrentQuestion() {
        const question = this.getCurrentSurvey().questions.find((question) => question.id === this.current_question_id);
        if (!question) {
            throw new Error(`Question with id ${this.current_question_id} not found`);
        }
        return question;
    }
}
exports.User = User;
