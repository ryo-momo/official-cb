"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageToConcierge = exports.externalPropertyAction = exports.terminateAction = void 0;
const flex_message_content_1 = require("../data/flex_message_content");
const config_1 = require("../data/config");
const zod_1 = __importDefault(require("zod"));
const error_handler_1 = require("../funcs/error_handler");
const terminateAction = (user, text) => {
    user.current_action_id = null;
    user.current_survey_id = null;
    user.current_step_id = null;
    user.current_question_id = null;
    user.current_answers = null;
    console.log("Terminating current action, progress won't be saved");
    return user;
};
exports.terminateAction = terminateAction;
const externalPropertyAction = (user, text) => {
    var _a;
    switch (user.current_step_id) {
        case null: {
            //user is in an initial step
            //return flex message to ask the method to share property
            const flex_design = (_a = flex_message_content_1.flex_message_contents.find((flex_message_content) => flex_message_content.id === 'externalProperty_share_method')) === null || _a === void 0 ? void 0 : _a.design;
            if (flex_design) {
                user.response.message = [
                    {
                        type: 'flex',
                        altText: '物件情報の共有方法を選択してください',
                        contents: flex_design,
                    },
                ];
                user.current_step_id = 'select_method';
            }
            else {
                user = (0, error_handler_1.errorHandler)({
                    INTERNAL_ERROR: error_handler_1.ERROR_LOGS.ACTION_HANDLER_NOT_FOUND,
                    USER_ERROR: error_handler_1.USER_ERROR_MESSAGES.INTERNAL_ERROR,
                }, user);
            }
            break;
        }
        case 'select_method': {
            switch (text) {
                case 'URLを送る':
                    user.current_step_id = 'send_url';
                    user.response.message = [
                        {
                            type: 'text',
                            text: '物件ページのURLをチャットでお送りください。',
                        },
                    ];
                    break;
                case 'PDFファイルを送る':
                    user.current_step_id = 'send_pdf';
                    user.response.message = [
                        {
                            type: 'text',
                            text: '申し訳ございませんが、公式LINEチャットではファイルを送信できないため、「担当者にメッセージ」から直接ファイルをお送りください。',
                        },
                    ];
                    user.current_step_id = 'complete';
                    break;
                case '画像を送る':
                    user.current_step_id = 'send_image';
                    user.response.message = [
                        {
                            type: 'text',
                            text: 'お手数ですが、「担当者にメッセージ」から直接画像をお送りください。',
                        },
                    ];
                    user.current_step_id = 'complete';
                    //TODO 画像を直接送れるようにする
                    break;
                default:
                    user = (0, error_handler_1.errorHandler)({
                        INTERNAL_ERROR: error_handler_1.ERROR_LOGS.ACTION_HANDLER_NOT_FOUND,
                        USER_ERROR: error_handler_1.USER_ERROR_MESSAGES.INTERNAL_ERROR,
                    }, user);
            }
            break;
        }
        case 'send_url': {
            // Define a schema to check URL format
            const url_schema = zod_1.default.string().url();
            // Check if the text sent by the user is in URL format
            const validation_result = url_schema.safeParse(text);
            if (validation_result.success) {
                user.response.message = [
                    {
                        type: 'text',
                        text: 'URLを受け取りました。確認後、担当者よりご連絡いたします。',
                    },
                ];
                // Move to the next step
                user.current_step_id = 'complete';
            }
            else {
                user = (0, error_handler_1.errorHandler)({
                    INTERNAL_ERROR: error_handler_1.ERROR_LOGS.INVALID_URL,
                    USER_ERROR: error_handler_1.USER_ERROR_MESSAGES.INVALID_URL,
                }, user);
            }
            break;
        }
        default: {
            user = (0, error_handler_1.errorHandler)({
                INTERNAL_ERROR: error_handler_1.ERROR_LOGS.INVALID_CURRENT_STEP,
                USER_ERROR: error_handler_1.USER_ERROR_MESSAGES.INTERNAL_ERROR,
            }, user);
        }
    }
    if (user.current_step_id === 'complete') {
        user.current_action_id = null;
        user.current_step_id = null;
    }
    return user;
};
exports.externalPropertyAction = externalPropertyAction;
const messageToConcierge = (user) => {
    user.response.message = [
        {
            type: 'text',
            text: `お問い合わせありがとうございます、こちらのURLより担当者とのトーク画面に遷移できます。\n\n${config_1.address_url}`,
        },
    ];
    user.current_action_id = null;
    return user;
};
exports.messageToConcierge = messageToConcierge;
