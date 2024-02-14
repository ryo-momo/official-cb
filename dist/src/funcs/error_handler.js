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
};
exports.USER_ERROR_MESSAGES = {
    INTERNAL_ERROR: '問題が発生しました。大変お手数ですが担当までお知らせください。',
    INVALID_URL: 'URLが無効な形式です。もう一度ご確認ください。',
};
const errorHandler = (error, user, detailedError) => {
    // エラーの詳細をログに記録
    if (detailedError) {
        console.error('Detailed error: ', detailedError);
    }
    // 内部エラーログを取得
    const internal_error_msg = error.INTERNAL_ERROR;
    // ユーザーエラーメッセージを取得
    const user_error_msg = error.USER_ERROR;
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
