import { messagingApi, Message, ReplyableEvent } from '@line/bot-sdk';

export class MessageSender {
    private client: messagingApi.MessagingApiClient;

    constructor(channelAccessToken: string) {
        this.client = new messagingApi.MessagingApiClient({ channelAccessToken });
    }

    async validateMessage(replyToken: string, messages: Message[]): Promise<void> {
        const validationResponse = await this.client.validateReply({
            messages: messages,
        });

        if (!validationResponse) {
            // Log: Invalid message format
            console.error('Invalid message format. Messages:', messages);
            throw new Error('Invalid message format. Messages: ' + JSON.stringify(messages));
        }
    }

    async sendReplyMessage(
        replyToken: string,
        messages: Message[],
        notificationDisabled = false
    ): Promise<void> {
        try {
            // Validate the messages before sending
            await this.validateMessage(replyToken, messages);

            const response = await this.client.replyMessage({
                replyToken: replyToken,
                messages: messages,
                notificationDisabled: notificationDisabled,
            });
            // Log: Message sent successfully
            console.log('Message sent successfully:', response);
        } catch (error: unknown) {
            // Log: Error sending message
            console.error('Error sending message:', (error as Error).message);
            throw new Error('Error sending message: ' + (error as Error).message);
        }
    }
}
