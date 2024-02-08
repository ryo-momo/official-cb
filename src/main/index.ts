import https from 'https';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { WebhookRequestBody, WebhookEvent } from '@line/bot-sdk';
import { webhookHandler } from '../funcs/webhook_handler';





export const LambdaHandler = async (event: WebhookRequestBody, context: Context) => {
    try {
        console.log('Received event:', JSON.stringify(event));

        await webhookHandler(event as WebhookRequestBody);

    } catch (error) {
        console.error('Error occurred:', error);
    }
}
