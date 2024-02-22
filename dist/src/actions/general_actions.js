"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageToConcierge = exports.externalPropertyAction = exports.errorTerminateAction = exports.terminateAction = void 0;
const flex_message_content_1 = require("../data/flex_message_content");
const config_1 = require("../data/config");
const zod_1 = __importDefault(require("zod"));
const error_handler_1 = require("../funcs/error_handler");
const message_helper_1 = require("../funcs/message_helper");
const terminateAction = (user, text) => {
    user.current_action_id = null;
    user.detour_action_id = null;
    user.current_survey_id = null;
    user.current_step_id = null;
    user.detour_step_id = null;
    user.current_question_id = null;
    user.current_answers = [];
    user.response.message.push({
        type: 'text',
        text: '現在のプロセスを中断しました。',
    });
    console.log("Terminating current action, progress won't be saved");
    return user;
};
exports.terminateAction = terminateAction;
const errorTerminateAction = (user, text) => __awaiter(void 0, void 0, void 0, function* () {
    switch (user.detour_step_id) {
        case null: {
            user.detour_action_id = 'error_terminate_action';
            console.log('asking the user if they want to terminate current action');
            user.response.message.push({
                type: 'text',
                text: '現在別のプロセスの進行中です。現在のプロセスを中断しますか？',
                quickReply: {
                    items: [
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: '中断する',
                                text: '中断する',
                            },
                        },
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: '中断しない',
                                text: '中断しない',
                            },
                        },
                    ],
                },
            });
            user.detour_step_id = 'terminate_or_continue';
            break;
        }
        case 'terminate_or_continue': {
            switch (text) {
                case '中断する':
                    console.log('terminating current action');
                    user.detour_action_id = null;
                    user.detour_step_id = null;
                    return (0, exports.terminateAction)(user, text);
                case '中断しない':
                    console.log('resuming current action');
                    user.detour_action_id = null;
                    user.detour_step_id = null;
                    yield (0, message_helper_1.setLastMessage)(user);
                    break;
                default: {
                    user.response.message.push((0, error_handler_1.errorHandler)('INPUT_OUT_OF_OPTION', 'INPUT_OUT_OF_OPTION', user));
                    user.response.message.push({
                        type: 'text',
                        text: '現在のプロセスを中断しますか？',
                        quickReply: {
                            items: [
                                {
                                    type: 'action',
                                    action: {
                                        type: 'message',
                                        label: '中断する',
                                        text: '中断する',
                                    },
                                },
                                {
                                    type: 'action',
                                    action: {
                                        type: 'message',
                                        label: '中断しない',
                                        text: '中断しない',
                                    },
                                },
                            ],
                        },
                    });
                    user.detour_step_id = 'terminate_or_continue';
                    break;
                }
            }
            break;
        }
        default: {
            user.response.message.push((0, error_handler_1.errorHandler)('INVALID_CURRENT_STEP', 'INTERNAL_ERROR', user));
            break;
        }
    }
    return user;
});
exports.errorTerminateAction = errorTerminateAction;
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
                user.response.message.push((0, error_handler_1.errorHandler)('FLEX_MESSAGE_NOT_FOUND', 'INTERNAL_ERROR', user));
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
                    user.response.message.push((0, error_handler_1.errorHandler)('INPUT_OUT_OF_OPTION', 'INTERNAL_ERROR', user));
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
                user.response.message.push((0, error_handler_1.errorHandler)('INVALID_URL', 'INVALID_URL', user));
            }
            break;
        }
        default: {
            user.response.message.push((0, error_handler_1.errorHandler)('INVALID_CURRENT_STEP', 'INTERNAL_ERROR', user));
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
