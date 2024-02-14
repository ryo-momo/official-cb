import { v4 as uuidv4 } from 'uuid';
import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { User } from '../classes/User';
import { db_data } from '../data/config';
import { user_states, globally_permitted_actions } from '../data/user_states';
import { actionInvoker } from '../actions/action_handler';
import { type Action } from '../data/user_states';

interface Event {
    user_line_id: string;
    text: string;
    timestamp: number;
}

// Return the action if a match is found, otherwise return null
const findActionByTrigger = (text: string): Action | null => {
    const action = user_states.actions.find((action: Action) =>
        action.trigger_text?.includes(text)
    );
    return action || null;
};

// Check if the action triggered by the text is allowed in the current minor state of the user
export const isActionAllowedInCurrentState = (user: User, text: string): boolean => {
    // First, identify the action invoked by the search for user_states.actions.trigger_text with text
    const action = user_states.actions.find((action: Action) =>
        action.trigger_text?.includes(text)
    );
    // If the action does not exist, it is not allowed
    if (!action) return false;
    // Get the current minor state of the user
    const current_minor_state = user.getCurrentMinorState();
    // Determine if it is allowed by the action ID
    const isAllowed = current_minor_state.permitted_actions.some(
        (permittedAction) => permittedAction === action.action_id
    );
    return isAllowed;
};

const handleNewUser = async (event: Event): Promise<{ user: User; succeed: boolean }> => {
    const dbc = new DatabaseCommunicator(db_data);
    await dbc.connect();
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
        }
    );
    // Assuming the rest of the code is unchanged and the DatabaseCommunicator instance is already created and connected.
    try {
        await dbc.insertUser(user);
        console.log('User saved successfully');
        return { user: user, succeed: true };
    } catch (err) {
        console.error('Error saving user: ', err);
        return { user: user, succeed: false };
    } finally {
        await dbc.disconnect();
    }
};

const handleExistingUser = async (
    event: Event
): Promise<{ user: User | null; succeed: boolean }> => {
    const dbc = new DatabaseCommunicator(db_data);
    await dbc.connect();
    console.log('User is an existing user');
    let user_property;
    try {
        user_property = await dbc.getUserByLineId(event.user_line_id);
        if (user_property === null) {
            throw new Error('User does not exist in the database');
        }
        let user = new User(user_property, {
            shouldReply: true,
        });

        const triggered_action = findActionByTrigger(event.text);
        if (triggered_action !== null) {
            if (isActionAllowedInCurrentState(user, event.text)) {
                if (
                    user.current_action_id !== null &&
                    globally_permitted_actions.includes(event.text)
                ) {
                    console.log(
                        'User is trying to start a new action while in the middle of another action'
                    );
                    return { user, succeed: false };
                } else {
                    console.log(
                        "User's is not in the middle of an action, and is starting a new one"
                    );
                    user.current_action_id = triggered_action.action_id;
                    user = await actionInvoker(user, event.text, triggered_action);
                    return { user: user, succeed: true };
                }
            } else {
                console.log(
                    'User is trying to do an action that is not allowed in the current state'
                );
                return { user: user, succeed: false };
            }
        } else {
            if (user.current_action_id === null) {
                console.log(
                    'User is sending a message that is not a trigger but user is not in the middle of an action either'
                );
                return { user: user, succeed: false };
            } else {
                console.log('User is in the middle of an action');
                user = await actionInvoker(user, event.text);
                return { user: user, succeed: true };
            }
        }
    } catch (err) {
        console.error('Error handling existing user: ', err);
        return { user: null, succeed: false };
    } finally {
        await dbc.disconnect();
    }
};

export const messageEventHandler = async (
    event: Event
): Promise<{ user: User | null; succeed: boolean }> => {
    const dbc = new DatabaseCommunicator(db_data);
    await dbc.connect();
    try {
        const userExists = await dbc.userExists(event.user_line_id);
        if (!userExists) {
            // this user is a brand new user
            return handleNewUser(event);
        } else {
            // user is an existing user
            return handleExistingUser(event);
        }
    } catch (err) {
        console.error('Error checking if user exists: ', err);
        return { user: null, succeed: false };
    } finally {
        await dbc.disconnect();
    }
};
