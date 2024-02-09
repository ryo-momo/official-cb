import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { User } from '../classes/User';
import { db_data } from '../data/config';
import { Action } from '../data/user_states';

const ERROR_MESSAGES = {
    HANDLER_NOT_FOUND: 'Handler not found in action',
};

async function invokeAction(user: User, text: string, action: Action): Promise<User> {
    console.log('Invoking action');
    user.current_action_id = action.action_id;
    if (action.handler) {
        user = await action.handler(user, text);
        console.log('Storing the user to database.'); // Log message
        try {
            let dbc = new DatabaseCommunicator(db_data);
            await dbc.updateUser(user);
        } catch (err) {
            console.error('Error updating user in database: ', err);
            // Handle the error appropriately
        }
    } else {
        throw new Error(ERROR_MESSAGES.HANDLER_NOT_FOUND);
    }
    return user;
}

export async function actionInvoker(
    user: User,
    text: string,
    action?: Action | null
): Promise<User> {
    console.log('🚀 ~ file: action_handler.ts:34 ~ user:', user.current_question_id);
    try {
        if (action) {
            return await invokeAction(user, text, action);
        } else {
            const current_action = user.getCurrentAction();
            return await invokeAction(user, text, current_action);
        }
    } catch (error) {
        console.error('Error in actionInvoker: ', error);
        // 必要に応じてエラーを再投げるか、適切なエラー処理を行う
        throw error;
    }
}
