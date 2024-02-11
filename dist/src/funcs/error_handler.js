"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, user) => {
    //get internal error log
    const internal_error_msg = error.INTERNAL_ERROR;
    //get user error message
    const user_error_msg = error.USER_ERROR;
    console.error(internal_error_msg);
    user.response.message = [
        {
            type: 'text',
            text: user_error_msg,
        },
    ];
    return user;
};
exports.errorHandler = errorHandler;
