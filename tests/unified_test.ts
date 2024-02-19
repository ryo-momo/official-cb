import { type WebhookRequestBody } from '@line/bot-sdk';
import { lambdaHandler } from '../src/main/index';
import { type Context } from 'aws-lambda';

export const CHANNEL_ACCESS_TOKEN =
    'JtMKGIsp5JJvfWrZUvqSruC7TEvVfhgTC6wFOQtmXtNmA5gZrgefZlw4gIUznwDeVuqTnqYOn+Hd7XwXIkm/A2/XKSOO7hXnlpFI2PagAVJQH1ni8kGXUFc96rsleA5qpbp3Jfa3EGO2NV+ZcpwZKgdB04t89/1O/w1cDnyilFU=';

const request_body: WebhookRequestBody = {
    destination: 'Ude07b1faacabdf9fc4971644c94fd76d',
    events: [
        {
            type: 'message',
            message: {
                type: 'text',
                id: '495035192646828310',
                quoteToken:
                    'a8HmM_iPwFU-eSUNxp3qH6DsGMdjNEcO27-gPtBPb9rUk8-ApE8BCf5phOnFbIcWJxBMlGD8mjZtc2S5UNGKsdXqI-Q4HTVYHBXEuw3vYOHf672h4kSFWvoJBrPUdq-fviNOym5_SvS5oeSnuwJT0Q',
                text: '>希望物件条件',
            },
            webhookEventId: '01HPK7VD95KK9CCAPWXS01QME3',
            deliveryContext: {
                isRedelivery: false,
            },
            timestamp: 1707895272232,
            source: {
                type: 'user',
                userId: 'Ue478ad4286f7e7b0d2baf5e39bdb9908',
            },
            replyToken: 'c70eb0dfc9dc4425bb8f03f3f0bb6afc',
            mode: 'active',
        },
    ],
};

void (async (): Promise<void> => {
    try {
        await lambdaHandler(request_body, null as unknown as Context);
    } catch (err) {
        console.error('Error in lambda handler: ', err);
    }
})();

//TODO 郵便番号が'1j'で通った^^;
