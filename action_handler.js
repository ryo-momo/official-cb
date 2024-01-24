function actionHandler(user, text, action) {
    //Invoke the action
    if (action) {
        //TODO: Invoke the action
        user = action.handler(user, text)
    }else{
        //TODO: Invoke user's current action
        user = user.getCurrentAction().handler(user, text);
    }
    return user;
}

module.exports = actionHandler
