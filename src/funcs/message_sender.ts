import { messagingApi, type Message, type MessageAPIResponseBase } from '@line/bot-sdk';

export class MessageSender {
    private readonly client: messagingApi.MessagingApiClient;

    constructor(private readonly channelAccessToken: string) {
        this.client = new messagingApi.MessagingApiClient({ channelAccessToken });
    }

    async isValidMessage(messages: Message[]): Promise<MessageAPIResponseBase> {
        try {
            const validation_response = await this.client.validateReply({
                messages: messages,
            });
            return validation_response;
        } catch (error: unknown) {
            throw new Error(`Error validating message: ${(error as Error).message}`);
        }
    }

    async validateAndSendReplyMessage(
        replyToken: string,
        messages: Message[],
        notificationDisabled = false
    ): Promise<void> {
        try {
            // Validate the messages before sending
            await this.isValidMessage(messages);

            const response = await this.client.replyMessage({
                replyToken: replyToken,
                messages: messages,
                notificationDisabled: notificationDisabled,
            });
            // Log: Message sent successfully
            console.log('Message sent successfully:', response);
        } catch (error: unknown) {
            // Log: Error sending message
            console.error();
            throw new Error(`Error sending message: ${(error as Error).message}`);
        }
    }
}
