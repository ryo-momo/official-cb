import { User } from '../classes/User';
import { Action } from '../data/user_states';

export function actionInvoker(user: User, text: string, action?: Action | null): User {
    //Invoke the action
    if (action) {
        console.log('Invoking new triggered action');
        user.current_action_id = action.action_id;
        if (action.handler) {
            user = action.handler(user, text);
        } else {
            throw new Error('Handler not found in action');
        }
    } else {
        console.log("Invoking user's current action");
        const current_action = user.getCurrentAction();
        if (current_action.handler) {
            user = current_action.handler(user, text);
        } else {
            throw new Error('Handler not found in action');
        }
    }
    return user;
}
