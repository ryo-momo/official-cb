const { MessagingApiClient } = require('@line/bot-sdk').messagingApi;

class MessageSender {
    constructor(channelAccessToken) {
        this.client = new MessagingApiClient({ channelAccessToken });
    }

    async validateMessage(replyToken, messages) {
        const validationResponse = await this.client.validateReply({
            replyToken: replyToken,
            messages: messages
        });

        if (!validationResponse) {
            // Log: Invalid message format
            console.error('Invalid message format. Messages:', messages);
            throw new Error('Invalid message format. Messages: ' + JSON.stringify(messages));
        }
    }

    async sendReplyMessage(replyToken, messages, notificationDisabled = false) {
        try {
            // Validate the messages before sending
            await this.validateMessage(replyToken, messages);

            const response = await this.client.replyMessage({
                replyToken: replyToken,
                messages: messages,
                notificationDisabled: notificationDisabled
            });
            // Log: Message sent successfully
            console.log('Message sent successfully:', response);
        } catch (error) {
            // Log: Error sending message
            console.error('Error sending message:', error.message);
            throw new Error('Error sending message: ' + error.message);
        }
    }
}

module.exports = MessageSender
