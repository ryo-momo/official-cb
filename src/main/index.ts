import { type EventBridgeEvent, type Context } from 'aws-lambda';
import { type WebhookRequestBody } from '@line/bot-sdk';
import { webhookHandler } from '../funcs/webhook_handler';

export const lambdaHandler = async (
    event: WebhookRequestBody | EventBridgeEvent<'Scheduled Event', {}>,
    context: Context
): Promise<void> => {
    try {
        console.log('Received event:', JSON.stringify(event));
        if ('detail-type' in event) {
            console.log('Scheduled Invocation');
        } else {
            await webhookHandler(event);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
};

//TODO 5分ごとに起動するやつ実装
//TODO 任意の情報を更新するやつ実装
