import { type Context } from 'aws-lambda';
import { type WebhookRequestBody } from '@line/bot-sdk';
import { webhookHandler } from '../funcs/webhook_handler';

export const lambdaHandler = async (event: WebhookRequestBody, context: Context): Promise<void> => {
    try {
        console.log('Received event:', JSON.stringify(event));
        await webhookHandler(event);
    } catch (error) {
        console.error('Error occurred:', error);
    }
};

//TODO 5分ごとに起動するやつ実装
