import { webhookHandler } from './src/funcs/webhook_handler';
import { WebhookRequestBody } from '@line/bot-sdk';

const YOUR_CHANNEL_ACCESS_TOKEN =
    '5q0BQsVkYmlb28z4s+7BKbYytgHutLg8OC1mDnpF6TheHb2o3+bEw4dMwQwDt9XgVuqTnqYOn+Hd7XwXIkm/A2/XKSOO7hXnlpFI2PagAVKCxNxUyC0F9MNgz8y/LkT1wVTeZsvRtW/6zUQAd0e56AdB04t89/1O/w1cDnyilFU=';
const request_body: WebhookRequestBody = {
    destination: 'Ude07b1faacabdf9fc4971644c94fd76d',
    events: [
        {
            type: 'message',
            message: {
                type: 'text',
                id: '489235210962207227',
                quoteToken:
                    'L9RsBpEYLH9GOcYH7b0Jf3tFzFuqmihcOFK6-SIgxjkfY6JVfw3cthFToNt02REUPD6zDOZ-iYIZdv3nhuAowKIcx19e6uEMDxzrObD4hy3TfMSS-B0bIaNXC7Ty2X4Dte2KRe37IvR5_bx75ehEnQ',
                text: '個',
            },
            webhookEventId: '01HKC6YB99P4X1WA0GQHMZQPMQ',
            deliveryContext: {
                isRedelivery: false,
            },
            timestamp: 1704438213713,
            source: {
                type: 'user',
                userId: 'Ue478ad4286f7e7b0d2baf5e39bdb9908',
            },
            replyToken: 'c76fd232a2104b689cc90a38a75defe3',
            mode: 'active',
        },
    ],
};

(async () => {
    try {
        const user = await webhookHandler(request_body);
        console.log('user is ', user);
    } catch (err) {
        console.error('Error in webhookHandler: ', err);
    }
})();
