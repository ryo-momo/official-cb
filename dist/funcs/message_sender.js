"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSender = void 0;
const bot_sdk_1 = require("@line/bot-sdk");
class MessageSender {
    constructor(channelAccessToken) {
        this.client = new bot_sdk_1.messagingApi.MessagingApiClient({ channelAccessToken });
    }
    isValidMessage(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResponse = yield this.client.validateReply({
                    messages: messages,
                });
                console.log('Validation response:', validationResponse);
                return validationResponse;
            }
            catch (error) {
                console.error('Error validating message:', error.message);
                throw new Error('Error validating message: ' + error.message);
            }
        });
    }
    validateAndSendReplyMessage(replyToken, messages, notificationDisabled = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the messages before sending
                yield this.isValidMessage(messages);
                const response = yield this.client.replyMessage({
                    replyToken: replyToken,
                    messages: messages,
                    notificationDisabled: notificationDisabled,
                });
                // Log: Message sent successfully
                console.log('Message sent successfully:', response);
            }
            catch (error) {
                // Log: Error sending message
                console.error('Error sending message:', error.message);
                throw new Error('Error sending message: ' + error.message);
            }
        });
    }
}
exports.MessageSender = MessageSender;
