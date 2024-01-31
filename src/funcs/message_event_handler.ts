import { v4 as uuidv4 } from 'uuid';
import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { User } from '../classes/User';
import { db_data } from '../data/config';
import { user_states } from '../data/user_states';
import { actionInvoker } from './action_handler';
import { Action } from '../data/user_states';

interface Event {
    user_line_id: string;
    text: string;
    timestamp: number;
    reply_token: string;
}

// Return the action if a match is found, otherwise return null
function findActionByTrigger(text: string): Action | null {
    const action = user_states.actions.find((action: Action) => action.trigger_text === text);
    return action || null;
}

// Check if the action triggered by the text is allowed in the current minor state of the user
export function isActionAllowedInCurrentState(user: User, text: string): boolean {
    // First, identify the action invoked by the search for user_states.actions.trigger_text with text
    const action = user_states.actions.find((action: Action) => action.trigger_text === text);
    // If the action does not exist, it is not allowed
    if (!action) return false;
    // Get the current minor state of the user
    const currentMinorState = user.getCurrentMinorState();
    // Determine if it is allowed by the action ID
    const isAllowed = currentMinorState.permitted_actions.some(
        (permittedAction) => permittedAction === action.action_id
    );
    return isAllowed;
}

async function handleNewUser(
    event: Event,
    reply_token: string
): Promise<{ user: User; succeed: boolean }> {
    const dbc = new DatabaseCommunicator(db_data);
    dbc.connect();
    console.log('User is a brand new user');
    let user = new User(
        {
            user_id: uuidv4(),
            user_line_id: event.user_line_id,
            major_state_id: user_states.major_states[0].state_id,
            minor_state_id: user_states.major_states[0].minor_states[0].state_id,
            current_action_id: null,
            current_survey_id: null,
            current_step_id: null,
            current_question_id: null,
            current_answers: null,
        },
        {
            shouldReply: true,
            reply_token: reply_token,
        }
    );
    // Assuming the rest of the code is unchanged and the DatabaseCommunicator instance is already created and connected.
    try {
        await dbc.insertUser(user);
        console.log('User saved successfully');
    } catch (err) {
        console.error('Error saving user: ', err);
    } finally {
        dbc.disconnect();
    }
    return { user: user, succeed: true };
}

async function handleExistingUser(
    event: Event,
    reply_token: string
): Promise<{ user: User; succeed: boolean }> {
    const dbc = new DatabaseCommunicator(db_data);
    dbc.connect();
    console.log('User is an existing user');
    const user_property = await dbc.getUserByLineId(event.user_line_id);
    if (user_property === null) {
        throw new Error('User does not exist in the database');
    }
    let user = new User(user_property, {
        shouldReply: true,
        reply_token: reply_token,
    });

    const triggered_action = findActionByTrigger(event.text);
    if (triggered_action !== null) {
        if (isActionAllowedInCurrentState(user, event.text)) {
            if (user.current_action_id !== null) {
                //TODO user is trying to start a new action while in the middle of another action
                //send a message that the user is in the middle of another action
                console.log(
                    'User is trying to start a new action while in the middle of another action'
                );
                return { user, succeed: false };
            } else {
                //TODO IN THE FUTURE: ask the user if they want to suspend the current action and start the new one
                console.log("User's is not in the middle of an action, and is starting a new one");
                user.current_action_id = triggered_action.action_id;
                user = actionInvoker(user, event.text, triggered_action);
                dbc.disconnect();
                return { user: user, succeed: true };
            }
        } else {
            //TODO user is trying to do an action that is not allowed in the current state
            //send a message to the user that the action is not allowed
            console.log('User is trying to do an action that is not allowed in the current state');
            return { user: user, succeed: false };
        }
    } else {
        if (user.current_action_id === null) {
            //TODO user is sending a message that is not a trigger but user is not in the middle of an action either
            //send an error message
            console.log(
                'User is sending a message that is not a trigger but user is not in the middle of an action either'
            );
            return { user: user, succeed: false };
        } else {
            //user is in the middle of an action
            console.log('User is in the middle of an action');
            user = actionInvoker(user, event.text);
            dbc.disconnect();
            return { user: user, succeed: true };
        }
    }
}

export async function messageEventHandler(
    event: Event,
    reply_token: string
): Promise<{ user: User; succeed: boolean }> {
    const dbc = new DatabaseCommunicator(db_data);
    dbc.connect();
    if (!(await dbc.userExists(event.user_line_id))) {
        //this user is a brand new user
        return handleNewUser(event, reply_token);
    } else {
        //user is an existing user
        return handleExistingUser(event, reply_token);
    }
}
