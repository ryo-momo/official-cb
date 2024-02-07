import { User } from '../classes/User';
import { flex_message_contents } from '../data/flex_message_content';
import z from 'zod';

export function externalPropertyAction(user: User, text: string): User {
    if (user.current_step_id === null) {
        //user is in an initial step
        //return flex message to ask the method to share property
        const flex_design = flex_message_contents.find(
            (flex_message_content) => flex_message_content.id === 'externalProperty_share_method'
        )?.design;
        if (flex_design) {
            user.response.message = {
                type: 'flex',
                altText: '物件情報の共有方法を選択してください',
                contents: flex_design,
            };
            user.current_step_id = 'select_method';
        } else {
            throw new Error('flex message not found');
        }
    } else if (user.current_step_id === 'select_method') {
        switch (text) {
            case 'URLを送る':
                user.current_step_id = 'send_url';
                user.response.message = {
                    type: 'text',
                    text: '物件ページのURLをチャットでお送りください。',
                };
                break;
            case 'PDFファイルを送る':
                user.current_step_id = 'send_pdf';
                user.response.message = {
                    type: 'text',
                    text: '申し訳ございませんが、公式LINEチャットではファイルを送信できないため、「担当者にメッセージ」から直接ファイルをお送りください。',
                };
                user.current_step_id = 'complete';
                break;
            case '画像を送る':
                user.current_step_id = 'send_image';
                user.response.message = {
                    type: 'text',
                    text: 'お手数ですが、「担当者にメッセージ」から直接画像をお送りください。',
                };
                user.current_step_id = 'complete';
                //TODO 画像を直接送れるようにする
                break;
            default:
                throw new Error('invalid message');
        }
    } else if (user.current_step_id === 'send_url') {
        // Define a schema to check URL format
        const urlSchema = z.string().url();

        // Check if the text sent by the user is in URL format
        const validationResult = urlSchema.safeParse(text);
        if (validationResult.success) {
            user.response.message = {
                type: 'text',
                text: 'URLを受け取りました。確認後、担当者よりご連絡いたします。',
            };
            // Move to the next step
            user.current_step_id = 'complete';
        } else {
            user.response.message = {
                type: 'text',
                text: '正しいURLを送信してください。',
            };
        }
    } else {
        throw new Error('invalid step');
    }
    if (user.current_step_id === 'complete') {
        user.current_action_id = null;
        user.current_step_id = null;
    }
    return user;
}
