const { v4: uuidv4 } = require('uuid');
const DatabaseCommunicator = require("./DatabaseCommunicator");
const User = require("./User");
const db_data = require("./data/config");
const user_states = require('./data/user_states');
const actionHandler = require('./action_handler');

// Return the action if a match is found, otherwise return null
function findActionByTrigger(text) {
    const action = user_states.actions.find(action => action.trigger_text === text);
    return action || null;
}

// Check if the action triggered by the text is allowed in the current minor state of the user
function isActionAllowedInCurrentState(user, text) {
    // First, identify the action invoked by the search for user_states.actions.trigger_text with text
    const action = user_states.actions.find(action => action.trigger_text === text);
    // If the action does not exist, it is not allowed
    if (!action) return false;
    // Get the current minor state of the user
    const currentMinorState = user.getCurrentMinorState();
    // Determine if it is allowed by the action ID
    const isAllowed = currentMinorState.permitted_actions.some(permittedAction => permittedAction === action.action_id);
    return isAllowed;
}

//event = {
//     user_line_id: "userLineId",
//     text: "text"
// }
//と想定
//TODO 日付も取得してそれに付随した一連の処理の実装
async function messageEventHandler(event) {
    dbc = new DatabaseCommunicator(db_data)
    //If the user exists in the DB
    dbc.connect()
    if (!(await dbc.userExists(event.user_line_id))) {
        //this user is a brand new user
        let user = new User({
            user_id: uuidv4(),
            user_line_id: event.user_line_id,
            major_state_id: user_states.major_states[0].state_id,
            minor_state_id: user_states.major_states[0].minor_states[0].state_id
        })
        // Assuming the rest of the code is unchanged and the DatabaseCommunicator instance is already created and connected.
        try {
            await dbc.saveUser(user);
            console.log("User saved successfully");
        } catch (err) {
            console.error("Error saving user: ", err);
        } finally {
            dbc.disconnect();
        }
        return user;
    } else {
        //user is an existing user
        let user = new User(await dbc.getUserByLineId(event.user_line_id));

        const triggered_action = findActionByTrigger(event.text)
        if (triggered_action !== null) {
            if (isActionAllowedInCurrentState(user, event.text)) {
                if (user.current_action_id !== null) {
                    //TODO user is trying to start a new action while in the middle of another action
                    console.log("User is trying to start a new action while in the middle of another action")
                    return user
                    //send a message that the user is in the middle of another action
                    //TODO IN THE FUTURE: ask the user if they want to suspend the current action and start the new one
                } else {
                    console.log("User is resuming the current action")
                    user = actionHandler(user, event.text, triggered_action)
                    dbc.disconnect()
                    return user
                }
            } else {
                //TODO user is trying to do an action that is not allowed in the current state
                //send a message to the user that the action is not allowed
                console.log("User is trying to do an action that is not allowed in the current state")
                return user
            }
        } else {
            if (user.current_action_id === null) {
                //TODO user is sending a message that is not a trigger but user is not in the middle of an action either
                //send an error message
                console.log("User is sending a message that is not a trigger but user is not in the middle of an action either")
                return user
            } else {
                //user is in the middle of an action
                console.log("User is in the middle of an action")
                user = actionHandler(user, event.text)
                dbc.disconnect()
                return user
            }
        }
    }
}

module.exports = messageEventHandler, isActionAllowedInCurrentState
