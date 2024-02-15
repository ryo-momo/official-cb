import { type FollowEvent } from '@line/bot-sdk';
import { User } from '../classes/User';
import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { db_data } from '../data/config';
import { v4 as uuidv4 } from 'uuid';
import { user_states } from '../data/user_states';
import { errorHandler } from './error_handler';

export const followEventHandler = async (
    event: FollowEvent
): Promise<{ user: User | null; succeed: boolean }> => {
    const dbc = new DatabaseCommunicator(db_data);
    if (event.source.userId) {
        if (await dbc.userExists(event.source.userId)) {
            //user is an existing user on DB
            console.log('User is an existing user');
            try {
                const user_data = await dbc.getUserByLineId(event.source.userId);
                if (user_data) {
                    const user = new User(user_data);
                    return { user: user, succeed: true };
                }
            } catch (error) {
                return {
                    user: new User(
                        {
                            user_id: null,
                            user_line_id: event.source.userId,
                            major_state_id: null,
                            minor_state_id: null,
                            current_action_id: null,
                            current_survey_id: null,
                            current_step_id: null,
                            current_question_id: null,
                            current_answers: null,
                        },
                        {
                            shouldReply: true,
                            reply_token: null,
                            message: [
                                errorHandler('UNKNOWN_ERROR', 'INTERNAL_ERROR', undefined, error),
                            ],
                        }
                    ),
                    succeed: false,
                };
            }
        } else {
            //user is a new user
            console.log('User is a new user, sending a greeting');
            const user = new User(
                {
                    user_id: uuidv4(),
                    user_line_id: event.source.userId,
                    major_state_id: user_states.major_states[0].state_id,
                    minor_state_id: user_states.major_states[0].minor_states[0].state_id,
                    current_action_id: null,
                    current_survey_id: null,
                    current_step_id: null,
                    current_question_id: null,
                    current_answers: null,
                },
                {
                    shouldReply: true,
                    reply_token: null,
                    message: [
                        {
                            type: 'text',
                            text: 'ご登録ありがとうございます！\nももたろう不動産の三上です😊一棟収益物件を中心に、専属のパートナーとして頼っていただけるように全力でサポートさせていただきます。\n\n私たちは以下のようなサービスをご提供しております：\n\n『物件紹介』『事業計画書作成』『専用ページによる検討物件のリスト作成』『出口戦略相談』『銀行打診代行』『購入後の物件管理』\n\nまずは画面下メニューの「お客様情報入力」より、お客様のご状況をお聞かせください🙇',
                        },
                    ],
                }
            );
            await dbc.insertUser(user);
            return { user: user, succeed: true };
        }
    }
    console.log('Followed by a non-user account, ignoring the event');
    return { user: null, succeed: true };
};
