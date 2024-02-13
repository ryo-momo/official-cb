import { type User } from '../classes/User';

export interface ErrorEvent {
    INTERNAL_ERROR: string;
    USER_ERROR: string;
}

export const errorHandler = (error: ErrorEvent, user: User): User => {
    //get internal error log
    const internal_error_msg = error.INTERNAL_ERROR;

    //get user error message
    const user_error_msg = error.USER_ERROR;

    //out put errors
    console.error(internal_error_msg);
    user.response.message = [
        {
            type: 'text',
            text: user_error_msg,
        },
    ];
    return user;
};
