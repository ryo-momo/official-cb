const { MessagingApiClient } = require('@line/bot-sdk').messagingApi;

class MessageSender {
    constructor(channelAccessToken) {
        this.client = new MessagingApiClient({ channelAccessToken });
    }

    async sendReplyMessage(replyToken, messages, notificationDisabled = false) {
        try {
            // Validate the messages before sending
            const validationResponse = await this.client.validateReply({
                replyToken: replyToken,
                messages: messages
            });

            if (!validationResponse) {
                // Log: Invalid message format
                console.error('Invalid message format');
                return;
            }

            const response = await this.client.replyMessage({
                replyToken: replyToken,
                messages: messages,
                notificationDisabled: notificationDisabled
            });
            // Log: Message sent successfully
            console.log('Message sent successfully:', response);
        } catch (error) {
            // Log: Error sending message
            console.error('Error sending message:', error);
        }
    }
}

module.exports = MessageSender

