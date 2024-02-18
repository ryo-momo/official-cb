import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { type User } from '../classes/User';
import { db_data } from '../data/config';
import { type Action } from '../data/user_states';
import { errorHandler } from '../funcs/error_handler';

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
            user.response.message.push(
                errorHandler('DATABASE_UPDATE_FAILED', 'INTERNAL_ERROR', user, err)
            );
        }
    } else {
        user.response.message.push(
            errorHandler('ACTION_HANDLER_NOT_FOUND', 'INTERNAL_ERROR', user)
        );
    }
    return user;
};

export const actionHandler = async (
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
    } catch (err) {
        const errorInstance = err instanceof Error ? err : new Error(`Unknown error: ${err}`);
        throw errorHandler('ACTION_HANDLER_NOT_FOUND', 'INTERNAL_ERROR', user, errorInstance);
    }
};
