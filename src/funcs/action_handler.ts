import { User } from '../classes/User';
import { Action } from '../data/user_states';

const ERROR_MESSAGES = {
    HANDLER_NOT_FOUND: 'Handler not found in action',
};

function invokeAction(user: User, text: string, action: Action): User {
    console.log('Invoking action');
    user.current_action_id = action.action_id;
    if (action.handler) {
        user = action.handler(user, text);
    } else {
        throw new Error(ERROR_MESSAGES.HANDLER_NOT_FOUND);
    }
    return user;
}

export function actionInvoker(user: User, text: string, action?: Action | null): User {
    if (action) {
        return invokeAction(user, text, action);
    } else {
        const current_action = user.getCurrentAction();
        return invokeAction(user, text, current_action);
    }
}
