import { type User } from '../classes/User';
import { flex_message_contents } from '../data/flex_message_content';
import { address_url } from '../data/config';
import z from 'zod';
import { errorHandler } from '../funcs/error_handler';
import { setLastMessage } from '../funcs/message_helper';

export const terminateAction = (user: User, text: string): User => {
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

export const errorTerminateAction = async (user: User, text: string): Promise<User> => {
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
                    return terminateAction(user, text);
                case '中断しない':
                    console.log('resuming current action');
                    user.detour_action_id = null;
                    user.detour_step_id = null;
                    await setLastMessage(user);
                    break;
                default:
                    user.response.message.push(
                        errorHandler('INPUT_OUT_OF_OPTION', 'INPUT_OUT_OF_OPTION', user)
                    );
            }
            break;
        }
        default: {
            user.response.message.push(
                errorHandler('INVALID_CURRENT_STEP', 'INTERNAL_ERROR', user)
            );
            break;
        }
    }
    return user;
};

export const externalPropertyAction = (user: User, text: string): User => {
    switch (user.current_step_id) {
        case null: {
            //user is in an initial step
            //return flex message to ask the method to share property
            const flex_design = flex_message_contents.find(
                (flex_message_content) =>
                    flex_message_content.id === 'externalProperty_share_method'
            )?.design;
            if (flex_design) {
                user.response.message = [
                    {
                        type: 'flex',
                        altText: '物件情報の共有方法を選択してください',
                        contents: flex_design,
                    },
                ];
                user.current_step_id = 'select_method';
            } else {
                user.response.message.push(
                    errorHandler('FLEX_MESSAGE_NOT_FOUND', 'INTERNAL_ERROR', user)
                );
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
                    user.response.message.push(
                        errorHandler('INPUT_OUT_OF_OPTION', 'INTERNAL_ERROR', user)
                    );
            }
            break;
        }
        case 'send_url': {
            // Define a schema to check URL format
            const url_schema = z.string().url();

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
            } else {
                user.response.message.push(errorHandler('INVALID_URL', 'INVALID_URL', user));
            }
            break;
        }
        default: {
            user.response.message.push(
                errorHandler('INVALID_CURRENT_STEP', 'INTERNAL_ERROR', user)
            );
        }
    }
    if (user.current_step_id === 'complete') {
        user.current_action_id = null;
        user.current_step_id = null;
    }
    return user;
};

export const messageToConcierge = (user: User): User => {
    user.response.message = [
        {
            type: 'text',
            text: `お問い合わせありがとうございます、こちらのURLより担当者とのトーク画面に遷移できます。\n\n${address_url}`,
        },
    ];
    user.current_action_id = null;
    return user;
};
