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
exports.textMessageEventHandler = exports.isActionAllowedInCurrentState = void 0;
const uuid_1 = require("uuid");
const DatabaseCommunicator_1 = require("../classes/DatabaseCommunicator");
const User_1 = require("../classes/User");
const config_1 = require("../data/config");
const user_states_1 = require("../data/user_states");
const action_handler_1 = require("../actions/action_handler");
const error_handler_1 = require("./error_handler");
// interface Event {
//     user_line_id: string;
//     text: string;
//     timestamp: number;
// }
// Return the action if a match is found, otherwise return null
const findActionByTrigger = (text) => {
    const action = user_states_1.user_states.actions.find((action) => { var _a; return (_a = action.trigger_text) === null || _a === void 0 ? void 0 : _a.includes(text); });
    return action || null;
};
// Check if the action triggered by the text is allowed in the current minor state of the user
const isActionAllowedInCurrentState = (user, text) => {
    // First, identify the action invoked by the search for user_states.actions.trigger_text with text
    const action = user_states_1.user_states.actions.find((action) => { var _a; return (_a = action.trigger_text) === null || _a === void 0 ? void 0 : _a.includes(text); });
    // If the action does not exist, it is not allowed
    if (!action)
        return false;
    // Get the current minor state of the user
    const current_minor_state = user.getCurrentMinorState();
    // Determine if it is allowed by the action ID
    const isAllowed = current_minor_state.permitted_actions.some((permittedAction) => permittedAction === action.action_id);
    return isAllowed;
};
exports.isActionAllowedInCurrentState = isActionAllowedInCurrentState;
const handleNewUser = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
    yield dbc.connect();
    console.log('User is a brand new user');
    let user = new User_1.User({
        user_id: (0, uuid_1.v4)(),
        user_line_id: event.source.userId,
        major_state_id: user_states_1.user_states.major_states[0].state_id,
        minor_state_id: user_states_1.user_states.major_states[0].minor_states[0].state_id,
        current_action_id: null,
        detour_action_id: null,
        current_survey_id: null,
        current_step_id: null,
        detour_step_id: null,
        current_question_id: null,
        current_answers: [],
    }, {
        shouldReply: false,
        reply_token: null,
        //TODOこの時点でユーザーが登録されていないのはおかしいため、エラーメッセージを送信
        message: [],
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
const handleExistingUser = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
    yield dbc.connect();
    console.log('User is an existing user');
    let user_property;
    const text_message = event.message;
    try {
        if (event.source.userId) {
            user_property = yield dbc.getUserByLineId(event.source.userId);
        }
        else {
            console.log('no user ID in the event, need URGENT fix!!');
            return { user: null, succeed: false };
        }
        if (user_property === null) {
            throw new Error('User does not exist in the database');
        }
        let user = new User_1.User(user_property, {
            shouldReply: true,
            reply_token: null,
            message: [],
        });
        console.log(JSON.stringify(user));
        const triggered_action = findActionByTrigger(text_message.text);
        if (triggered_action !== null) {
            if ((0, exports.isActionAllowedInCurrentState)(user, text_message.text)) {
                if (user.current_action_id !== null) {
                    if (user_states_1.globally_permitted_actions.includes(triggered_action.action_id)) {
                        console.log('User is trying to invoke a globally permitted action');
                        user.current_action_id = triggered_action.action_id;
                        const result = yield (0, action_handler_1.invokeAction)(user, text_message.text, triggered_action.action_id, false);
                        return { user: result, succeed: true };
                    }
                    else {
                        console.log('User is trying to invoke a non-globally permitted action while in another action');
                        //TODO 中断しますか？というメッセージを送信
                        user = yield (0, action_handler_1.invokeAction)(user, text_message.text, 'error_terminate_action', true);
                        // user = await errorTerminateAction(user, text_message.text);
                        return { user, succeed: true };
                    }
                }
                else {
                    console.log("User's is not in the middle of an action, and is starting a new one");
                    user.current_action_id = triggered_action.action_id;
                    user.current_step_id = null;
                    const result = yield (0, action_handler_1.invokeAction)(user, text_message.text, triggered_action.action_id, false);
                    return { user: result, succeed: true };
                }
            }
            else {
                (_a = user.response.message) === null || _a === void 0 ? void 0 : _a.push((0, error_handler_1.errorHandler)('FORBIDDEN_ACTION', 'FORBIDDEN_ACTION', user), ...((yield dbc.getLastMessage(user.user_line_id)) || []));
                return { user: user, succeed: false };
            }
        }
        else {
            if (user.current_action_id === null) {
                user.response.message.push((0, error_handler_1.errorHandler)('NON_TRIGGER_MESSAGE_NO_ACTION', 'NON_TRIGGER_MESSAGE_NO_ACTION', user));
                return { user: user, succeed: false };
            }
            else {
                if (user.detour_action_id === null) {
                    console.log('User is in the middle of an action');
                    user = yield (0, action_handler_1.invokeAction)(user, text_message.text, user.current_action_id, false);
                    return { user: user, succeed: true };
                }
                else {
                    console.log('User is in the middle of a detour action');
                    user = yield (0, action_handler_1.invokeAction)(user, text_message.text, user.detour_action_id, true);
                    return { user, succeed: true };
                }
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
const textMessageEventHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
    yield dbc.connect();
    const user_id = event.source.userId;
    if (user_id) {
        try {
            const userExists = yield dbc.userExists(user_id);
            if (!userExists) {
                // this user is a brand new user
                return handleNewUser(event);
            }
            else {
                // user is an existing user
                const result = yield handleExistingUser(event);
                return result;
            }
        }
        catch (err) {
            console.error('Error checking if user exists: ', err);
            return { user: null, succeed: false };
        }
        finally {
            yield dbc.disconnect();
        }
    }
    else {
        console.log('received an non-user message');
        return { user: null, succeed: false };
    }
});
exports.textMessageEventHandler = textMessageEventHandler;
