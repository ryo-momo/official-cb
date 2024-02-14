import { type User } from '../classes/User';

export interface ErrorEvent {
    INTERNAL_ERROR: string;
    USER_ERROR: string;
}

export const ERROR_LOGS: { [key: string]: string } = {
    ACTION_HANDLER_NOT_FOUND: 'Handler not found in action',
    DATABASE_UPDATE_FAILED: 'Failed to update user in database',
    FLEX_MESSAGE_NOT_FOUND: 'Flex message not found',
    INVALID_MESSAGE: 'Invalid message for select_method',
    INVALID_CURRENT_STEP: "User's current step is invalid",
    INVALID_URL: 'User sent the invalid URL',
    DATABASE_CONNECTION_FAILED: 'Failed to connect to the database',
    FORBIDDEN_ACTION: 'User is trying to do an action that is not allowed in the current state',
};

export const USER_ERROR_MESSAGES: { [key: string]: string } = {
    INTERNAL_ERROR: '問題が発生しました。大変お手数ですが担当までお知らせください。',
    INVALID_URL: 'URLが無効な形式です。もう一度ご確認ください。',
    FORBIDDEN_ACTION:
        '現在その操作は行うことができません。実行中の操作をキャンセルまたは完了してください。',
};

export const errorHandler = (
    internal_error_code: string,
    user_error_code: string,
    user: User,
    detailedError?: Error
): User => {
    const internal_error_msgs = ERROR_LOGS;
    const user_error_msgs = USER_ERROR_MESSAGES;
    // エラーの詳細をログに記録
    if (detailedError) {
        console.error('Detailed error: ', detailedError);
    }

    // 内部エラーログを取得
    const internal_error_msg = internal_error_msgs[internal_error_code];

    // ユーザーエラーメッセージを取得
    const user_error_msg = user_error_msgs[user_error_code];

    // エラーをログに出力
    console.error(internal_error_msg);

    // ユーザーに返すメッセージを設定
    user.response.message = [
        {
            type: 'text',
            text: user_error_msg,
        },
    ];
    return user;
};
