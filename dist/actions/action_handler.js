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
exports.actionInvoker = void 0;
const DatabaseCommunicator_1 = require("../classes/DatabaseCommunicator");
const config_1 = require("../data/config");
const ERROR_MESSAGES = {
    HANDLER_NOT_FOUND: 'Handler not found in action',
};
function invokeAction(user, text, action) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Invoking action:', action.action_id);
        user.current_action_id = action.action_id;
        if (action.handler) {
            user = yield action.handler(user, text);
            console.log('Storing the user to database.'); // Log message
            try {
                let dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
                yield dbc.updateUser(user);
            }
            catch (err) {
                console.error('Error updating user in database: ', err);
                // Handle the error appropriately
            }
        }
        else {
            throw new Error(ERROR_MESSAGES.HANDLER_NOT_FOUND);
        }
        return user;
    });
}
function actionInvoker(user, text, action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (action) {
                return yield invokeAction(user, text, action);
            }
            else {
                const current_action = user.getCurrentAction();
                return yield invokeAction(user, text, current_action);
            }
        }
        catch (error) {
            console.error('Error in actionInvoker: ', error);
            // 必要に応じてエラーを再投げるか、適切なエラー処理を行う
            throw error;
        }
    });
}
exports.actionInvoker = actionInvoker;
