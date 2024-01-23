const { MessagingApiClient } = require('@line/bot-sdk').messagingApi;

class MessageSender {
    constructor(channelAccessToken) {
        this.client = new MessagingApiClient({ channelAccessToken });
    }

    async sendReplyMessage(replyToken, messages, notificationDisabled = false) {
        try {
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

