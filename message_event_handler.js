const { v4: uuidv4 } = require('uuid');
const DatabaseCommunicator = require("./DatabaseCommunicator");
const User = require("./User");
const db_data = require("./data/config");
const user_states = require('./data/user_states');

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
    const isAllowed = currentMinorState.permitted_actions.some(permittedAction => permittedAction === action.id);
    return isAllowed;
}

//event = {
//     user_line_id: "userLineId",
//     text: "text"
// }
//と想定
//TODO 日付も取得してそれに付随した一連の処理の実装
function messageEventHandler(event) {
    dbc = DatabaseCommunicator(db_data)
    //If the user exists in the DB
    if (dbc.userExists(event.user_line_id)) {
        //this user is a brand new user
        const user = new User({
            user_id: uuidv4(),
            user_line_id: event.user_line_id,
            major_state_id: user_states.major_states[0].state_id,
            minor_state_id: user_states.major_states[0].minor_states[0].state_id
        })
        dbc.connect()
        dbc.insertUser(user)
        dbc.disconnect()
    } else {
        //user is an existing user
        dbc.connect()
        const user = new User(dbc.getUserByLineId(event.user_line_id))
        dbc.disconnect()

        const triggered_action = findActionByTrigger(event.text)
        if (triggered_action !== null) {
            if(isActionAllowedInCurrentState(user, event.text)){
                user = actionHandler(user, event.text, triggered_action)
                if(user.current_action_id !== null){
                    //TODO user is trying to start a new action while in the middle of another action
                    //send a message that the user is in the middle of another action
                    //TODO IN THE FUTURE: ask the user if they want to suspend the current action and start the new one
                }
            } else {
                //TODO user is trying to do an action that is not allowed in the current state
                //send a message to the user that the action is not allowed
            }
        } else {
            if (user.current_action_id === null) {
                //TODO user is sending a message that is not a trigger but user is not in the middle of an action either
                //send an error message
            } else {
                //user is in the middle of an action
                user = actionHandler(user, event.text)
                return user
            }
        }
    }
}

module.exports = messageEventHandler

