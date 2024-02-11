import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { type User } from '../classes/User';
import { db_data } from '../data/config';
import { type Action } from '../data/user_states';

const ERROR_MESSAGES = {
    HANDLER_NOT_FOUND: 'Handler not found in action',
};

const invokeAction = async (user: User, text: string, action: Action): Promise<User> => {
    console.log('Invoking action:', action.action_id);
    user.current_action_id = action.action_id;
    if (action.handler) {
        user = await action.handler(user, text);
        console.log('Storing the user to database.'); // Log message
        try {
            const dbc = new DatabaseCommunicator(db_data);
            await dbc.updateUser(user);
        } catch (err) {
            console.error('Error updating user in database: ', err);
            // Handle the error appropriately
        }
    } else {
        throw new Error(ERROR_MESSAGES.HANDLER_NOT_FOUND);
    }
    return user;
};

export const actionInvoker = async (
    user: User,
    text: string,
    action?: Action | null
): Promise<User> => {
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
};
