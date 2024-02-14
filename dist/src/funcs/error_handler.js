"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.USER_ERROR_MESSAGES = exports.ERROR_LOGS = void 0;
exports.ERROR_LOGS = {
    ACTION_HANDLER_NOT_FOUND: 'Handler not found in action',
    DATABASE_UPDATE_FAILED: 'Failed to update user in database',
    FLEX_MESSAGE_NOT_FOUND: 'Flex message not found',
    INVALID_MESSAGE: 'Invalid message for select_method',
    INVALID_CURRENT_STEP: "User's current step is invalid",
    INVALID_URL: 'User sent the invalid URL',
    DATABASE_CONNECTION_FAILED: 'Failed to connect to the database',
    FORBIDDEN_ACTION: 'User is trying to do an action that is not allowed in the current state',
};
exports.USER_ERROR_MESSAGES = {
    INTERNAL_ERROR: '問題が発生しました。大変お手数ですが担当までお知らせください。',
    INVALID_URL: 'URLが無効な形式です。もう一度ご確認ください。',
    FORBIDDEN_ACTION: '現在その操作は行うことができません。実行中の操作をキャンセルまたは完了してください。',
};
const errorHandler = (internal_error_code, user_error_code, user, detailedError) => {
    const internal_error_msgs = exports.ERROR_LOGS;
    const user_error_msgs = exports.USER_ERROR_MESSAGES;
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
exports.errorHandler = errorHandler;
