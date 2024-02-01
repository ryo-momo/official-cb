import { messageEventHandler } from './message_event_handler';
import { WebhookRequestBody, WebhookEvent } from '@line/bot-sdk';
import { User } from '../classes/User';

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

async function eventResultHandler(result: object) {
    //TODO　reply送信など
}

export async function webhookHandler(request_body: WebhookRequestBody) {
    const promises = request_body.events.map(async (event) => {
        try {
            const result = await webhookEventHandler(event);
            // eventResultHandler(result);
            return result;
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
): Promise<{ user: User | null; succeed: boolean } | boolean> {
    // Check if the event type is "message"
    if (event.type === 'message') {
        if (event.source.type === 'user') {
            if ('text' in event.message && event.message.text) {
                console.log('User Message event received');
                try {
                    const result = await messageEventHandler(
                        {
                            user_line_id: event.source.userId,
                            text: event.message.text,
                            timestamp: event.timestamp,
                            reply_token: event.replyToken,
                        },
                        event.replyToken
                    );
                    return result;
                } catch (error) {
                    console.error('Error in messageEventHandler:', error);
                    return false;
                }
            } else {
                console.log(
                    'User Message event received but no text, perhaps an StickerMessageEvent'
                );
                return false;
            }
        } else {
            console.log('Non-user event received');
            return false;
        }
    } else {
        // TODO: Handle non-message event
        console.log('Non-message event received');
        return false;
    }
}
