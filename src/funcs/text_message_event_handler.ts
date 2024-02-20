import { v4 as uuidv4 } from 'uuid';
import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { User } from '../classes/User';
import { db_data } from '../data/config';
import { user_states, globally_permitted_actions } from '../data/user_states';
import { actionHandler } from '../actions/action_handler';
import { type Action } from '../data/user_states';
import { errorHandler } from './error_handler';
import { type TextEventMessage, type MessageEvent } from '@line/bot-sdk';
import { type Result } from './webhook_handler';

// interface Event {
//     user_line_id: string;
//     text: string;
//     timestamp: number;
// }

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

const handleNewUser = async (event: MessageEvent): Promise<Result> => {
    const dbc = new DatabaseCommunicator(db_data);
    await dbc.connect();
    console.log('User is a brand new user');
    let user = new User(
        {
            user_id: uuidv4(),
            user_line_id: event.source.userId!,
            major_state_id: user_states.major_states[0].state_id,
            minor_state_id: user_states.major_states[0].minor_states[0].state_id,
            current_action_id: null,
            current_survey_id: null,
            current_step_id: null,
            current_question_id: null,
            current_answers: [],
        },
        {
            shouldReply: true,
            reply_token: null,
            //TODOこの時点でユーザーが登録されていないのはおかしいため、エラーメッセージを送信
            message: [],
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

const handleExistingUser = async (event: MessageEvent): Promise<Result> => {
    const dbc = new DatabaseCommunicator(db_data);
    await dbc.connect();
    console.log('User is an existing user');
    let user_property;
    const text_message = event.message as TextEventMessage;
    try {
        if (event.source.userId) {
            user_property = await dbc.getUserByLineId(event.source.userId);
        } else {
            console.log('no user ID in the event, need URGENT fix!!');
            return { user: null, succeed: false };
        }

        if (user_property === null) {
            throw new Error('User does not exist in the database');
        }
        let user = new User(user_property, {
            shouldReply: true,
            reply_token: null,
            message: [],
        });

        const triggered_action = findActionByTrigger(text_message.text);
        if (triggered_action !== null) {
            if (isActionAllowedInCurrentState(user, text_message.text)) {
                if (user.current_action_id !== null) {
                    if (globally_permitted_actions.includes(triggered_action.action_id)) {
                        console.log('User is trying to invoke a globally permitted action');
                        user.current_action_id = triggered_action.action_id;
                        const result = await actionHandler(
                            user,
                            text_message.text,
                            triggered_action
                        );
                        return { user: result, succeed: true };
                    } else {
                        console.log('User is trying to invoke a non-globally permitted action');
                        user.response.message.push(
                            errorHandler(
                                'NEW_ACTION_WHILE_IN_PROGRESS',
                                'NEW_ACTION_WHILE_IN_PROGRESS',
                                user
                            )
                        );
                        //TODO 中断しますか？というメッセージを送信
                        return { user, succeed: false };
                    }
                } else {
                    console.log(
                        "User's is not in the middle of an action, and is starting a new one"
                    );
                    user.current_action_id = triggered_action.action_id;
                    user.current_step_id = null;
                    const result = await actionHandler(user, text_message.text, triggered_action);
                    return { user: result, succeed: true };
                }
            } else {
                user.response.message?.push(
                    errorHandler('FORBIDDEN_ACTION', 'FORBIDDEN_ACTION', user)
                );
                return { user: user, succeed: false };
            }
        } else {
            if (user.current_action_id === null) {
                user.response.message.push(
                    errorHandler(
                        'NON_TRIGGER_MESSAGE_NO_ACTION',
                        'NON_TRIGGER_MESSAGE_NO_ACTION',
                        user
                    )
                );
                return { user: user, succeed: false };
            } else {
                console.log('User is in the middle of an action');
                user = await actionHandler(user, text_message.text);
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

export const textMessageEventHandler = async (event: MessageEvent): Promise<Result> => {
    const dbc = new DatabaseCommunicator(db_data);
    await dbc.connect();
    const user_id = event.source.userId;
    if (user_id) {
        try {
            const userExists = await dbc.userExists(user_id);
            if (!userExists) {
                // this user is a brand new user
                return handleNewUser(event);
            } else {
                // user is an existing user
                const result = await handleExistingUser(event);
                return result;
            }
        } catch (err) {
            console.error('Error checking if user exists: ', err);
            return { user: null, succeed: false };
        } finally {
            await dbc.disconnect();
        }
    } else {
        console.log('received an non-user message');
        return { user: null, succeed: false };
    }
};
