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
exports.invokeAction = void 0;
const DatabaseCommunicator_1 = require("../classes/DatabaseCommunicator");
const config_1 = require("../data/config");
const user_states_1 = require("../data/user_states");
const error_handler_1 = require("../funcs/error_handler");
const getActionById = (action_id) => {
    const action = user_states_1.user_states.actions.find((action) => action.action_id === action_id);
    if (action) {
        return action;
    }
    else {
        throw new Error(`Action not found: ${action_id}`);
    }
};
const invokeAction = (user, text, action_id, isDetour) => __awaiter(void 0, void 0, void 0, function* () {
    if (isDetour) {
        console.log('Invoking detour action:', action_id);
        user.detour_action_id = action_id;
    }
    else {
        console.log('Invoking action:', action_id);
        user.current_action_id = action_id;
    }
    const action = getActionById(action_id);
    if (action.handler) {
        user = yield action.handler(user, text);
        console.log('Storing the user to database.'); // Log message
        try {
            const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
            yield dbc.updateUser(user);
        }
        catch (err) {
            user.response.message.push((0, error_handler_1.errorHandler)('DATABASE_UPDATE_FAILED', 'INTERNAL_ERROR', user, err));
        }
    }
    else {
        user.response.message.push((0, error_handler_1.errorHandler)('ACTION_HANDLER_NOT_FOUND', 'INTERNAL_ERROR', user));
    }
    return user;
});
exports.invokeAction = invokeAction;
