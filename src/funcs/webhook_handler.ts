import { messageEventHandler } from './message_event_handler';
import { WebhookRequestBody, WebhookEvent } from '@line/bot-sdk';
import { User } from '../classes/User';
import { MessageSender } from './message_sender';
import dotenv from 'dotenv';

dotenv.config();

//example of LINE event

// {
//     "destination": "Ude07b1faacabdf9fc4971644c94fd76d",
//     "events": [
//         {
//             "type": "message",
//             "message": {
//                 "type": "text",
//                 "id": "489235210962207227",
//                 "quoteToken": "L9RsBpEYLH9GOcYH7b0Jf3tFzFuqmihcOFK6-SIgxjkfY6JVfw3cthFToNt02REUPD6zDOZ-iYIZdv3nhuAowKIcx19e6uEMDxzrObD4hy3TfMSS-B0bIaNXC7Ty2X4Dte2KRe37IvR5_bx75ehEnQ",
//                 "text": "Aaa"
//             },
//             "webhookEventId": "01HKC6YB99P4X1WA0GQHMZQPMQ",
//             "deliveryContext": {
//                 "isRedelivery": false
//             },
//             "timestamp": 1704438213713,
//             "source": {
//                 "type": "user",
//                 "userId": "Ue478ad4286f7e7b0d2baf5e39bdb9908"
//             },
//             "replyToken": "c76fd232a2104b689cc90a38a75defe3",
//             "mode": "active"
//         }
//     ]
// }

interface Result {
    user: User | null;
    succeed: boolean;
}

async function eventResultHandler(result: Result, reply_token: string) {
    const ms = new MessageSender(process.env.CHANNEL_ACCESS_TOKEN!);
    if (result.user) {
        if (result.user.response.message) {
            try {
                console.log('sending user a response');
                await ms.validateAndSendReplyMessage(reply_token, result.user.response.message);
            } catch (err) {
                console.error('Error in sending message:', err);
            }
        }
    }
}

export async function webhookHandler(request_body: WebhookRequestBody) {
    const promises = request_body.events.map(async (event) => {
        try {
            if ('replyToken' in event) {
                const result = await webhookEventHandler(event);
                //enable when testing on lambda
                await eventResultHandler(result, event.replyToken);
                return result;
            } else {
                console.log('Event does not have a replyToken:', event);
                return false;
            }
        } catch (error) {
            console.error('Error in webhookEventHandler:', error);
            return false;
        }
    });

    const results: Array<any> = [];
    try {
        for (const promise of promises) {
            try {
                const result = await promise;
                results.push(result);
            } catch (error) {
                console.error('Error in promise:', error);
            }
        }
    } catch (error) {
        console.error('Error in processing promises:', error);
    }
    console.log(
        'Results of all promises including nested objects:',
        JSON.stringify(results, null, 2)
    );
}

export async function webhookEventHandler(
    event: WebhookEvent
): Promise<{ user: User | null; succeed: boolean }> {
    // Check if the event type is "message"
    if (event.type === 'message') {
        if (event.source.type === 'user') {
            if ('text' in event.message && event.message.text) {
                console.log('User Message event received');
                try {
                    const result = await messageEventHandler({
                        user_line_id: event.source.userId,
                        text: event.message.text,
                        timestamp: event.timestamp,
                    });
                    return result;
                } catch (error) {
                    console.error('Error in messageEventHandler:', error);
                    return { user: null, succeed: false };
                }
            } else {
                console.log(
                    'User Message event received but no text, perhaps an StickerMessageEvent'
                );
                return { user: null, succeed: false };
            }
        } else {
            console.log('Non-user event received');
            return { user: null, succeed: false };
        }
    } else {
        // TODO: Handle non-message event
        console.log('Non-message event received');
        return { user: null, succeed: false };
    }
}
