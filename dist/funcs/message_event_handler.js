"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageEventHandler = exports.isActionAllowedInCurrentState = void 0;
const uuid_1 = require("uuid");
const DatabaseCommunicator_1 = require("../classes/DatabaseCommunicator");
const User_1 = require("../classes/User");
const config_1 = require("../data/config");
const user_states_1 = require("../data/user_states");
const action_handler_1 = require("../actions/action_handler");
// Return the action if a match is found, otherwise return null
function findActionByTrigger(text) {
    const action = user_states_1.user_states.actions.find((action) => { var _a; return (_a = action.trigger_text) === null || _a === void 0 ? void 0 : _a.includes(text); });
    return action || null;
}
// Check if the action triggered by the text is allowed in the current minor state of the user
function isActionAllowedInCurrentState(user, text) {
    // First, identify the action invoked by the search for user_states.actions.trigger_text with text
    const action = user_states_1.user_states.actions.find((action) => { var _a; return (_a = action.trigger_text) === null || _a === void 0 ? void 0 : _a.includes(text); });
    // If the action does not exist, it is not allowed
    if (!action)
        return false;
    // Get the current minor state of the user
    const currentMinorState = user.getCurrentMinorState();
    // Determine if it is allowed by the action ID
    const isAllowed = currentMinorState.permitted_actions.some((permittedAction) => permittedAction === action.action_id);
    return isAllowed;
}
exports.isActionAllowedInCurrentState = isActionAllowedInCurrentState;
function handleNewUser(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
        yield dbc.connect();
        console.log('User is a brand new user');
        let user = new User_1.User({
            user_id: (0, uuid_1.v4)(),
            user_line_id: event.user_line_id,
            major_state_id: user_states_1.user_states.major_states[0].state_id,
            minor_state_id: user_states_1.user_states.major_states[0].minor_states[0].state_id,
            current_action_id: null,
            current_survey_id: null,
            current_step_id: null,
            current_question_id: null,
            current_answers: null,
        }, {
            shouldReply: true,
        });
        // Assuming the rest of the code is unchanged and the DatabaseCommunicator instance is already created and connected.
        try {
            yield dbc.insertUser(user);
            console.log('User saved successfully');
            return { user: user, succeed: true };
        }
        catch (err) {
            console.error('Error saving user: ', err);
            return { user: user, succeed: false };
        }
        finally {
            yield dbc.disconnect();
        }
    });
}
function handleExistingUser(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
        yield dbc.connect();
        console.log('User is an existing user');
        let user_property;
        try {
            user_property = yield dbc.getUserByLineId(event.user_line_id);
            if (user_property === null) {
                throw new Error('User does not exist in the database');
            }
            let user = new User_1.User(user_property, {
                shouldReply: true,
            });
            const triggered_action = findActionByTrigger(event.text);
            if (triggered_action !== null) {
                if (isActionAllowedInCurrentState(user, event.text)) {
                    if (user.current_action_id !== null &&
                        user_states_1.global_permitted_actions.includes(event.text)) {
                        console.log('User is trying to start a new action while in the middle of another action');
                        return { user, succeed: false };
                    }
                    else {
                        console.log("User's is not in the middle of an action, and is starting a new one");
                        user.current_action_id = triggered_action.action_id;
                        user = yield (0, action_handler_1.actionInvoker)(user, event.text, triggered_action);
                        return { user: user, succeed: true };
                    }
                }
                else {
                    console.log('User is trying to do an action that is not allowed in the current state');
                    return { user: user, succeed: false };
                }
            }
            else {
                if (user.current_action_id === null) {
                    console.log('User is sending a message that is not a trigger but user is not in the middle of an action either');
                    return { user: user, succeed: false };
                }
                else {
                    console.log('User is in the middle of an action');
                    user = yield (0, action_handler_1.actionInvoker)(user, event.text);
                    return { user: user, succeed: true };
                }
            }
        }
        catch (err) {
            console.error('Error handling existing user: ', err);
            return { user: null, succeed: false };
        }
        finally {
            yield dbc.disconnect();
        }
    });
}
function messageEventHandler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
        yield dbc.connect();
        try {
            const userExists = yield dbc.userExists(event.user_line_id);
            if (!userExists) {
                // this user is a brand new user
                return handleNewUser(event);
            }
            else {
                // user is an existing user
                return handleExistingUser(event);
            }
        }
        catch (err) {
            console.error('Error checking if user exists: ', err);
            return { user: null, succeed: false };
        }
        finally {
            yield dbc.disconnect();
        }
    });
}
exports.messageEventHandler = messageEventHandler;
