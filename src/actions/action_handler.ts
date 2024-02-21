import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { type User } from '../classes/User';
import { db_data } from '../data/config';
import { type Action, user_states } from '../data/user_states';
import { errorHandler } from '../funcs/error_handler';

const getActionById = (action_id: string): Action => {
    const action = user_states.actions.find((action: Action) => action.action_id === action_id);
    if (action) {
        return action;
    } else {
        throw new Error(`Action not found: ${action_id}`);
    }
};

export const invokeAction = async (
    user: User,
    text: string,
    action_id: string,
    isDetour: boolean
): Promise<User> => {
    if (isDetour) {
        console.log('Invoking detour action:', action_id);
        user.detour_action_id = action_id;
    } else {
        console.log('Invoking action:', action_id);
        user.current_action_id = action_id;
    }
    const action = getActionById(action_id);
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
