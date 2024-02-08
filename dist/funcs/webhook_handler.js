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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookEventHandler = exports.webhookHandler = void 0;
const message_event_handler_1 = require("./message_event_handler");
const message_sender_1 = require("./message_sender");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function eventResultHandler(result, reply_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const ms = new message_sender_1.MessageSender(process.env.CHANNEL_ACCESS_TOKEN);
        if (result.user) {
            console.log('🚀 ~ file: webhook_handler.ts:46 ~ eventResultHandler ~ user:', result.user);
            if (result.user.response.message) {
                console.log('🚀 ~ file: webhook_handler.ts:48 ~ eventResultHandler ~ result:', result.user.response.message);
                try {
                    console.log('sending user a response');
                    yield ms.validateAndSendReplyMessage(reply_token, result.user.response.message);
                }
                catch (err) {
                    console.error('Error in sending message:', err);
                }
            }
        }
    });
}
function webhookHandler(request_body) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = request_body.events.map((event) => __awaiter(this, void 0, void 0, function* () {
            try {
                if ('replyToken' in event) {
                    const result = yield webhookEventHandler(event);
                    console.log('🚀 ~ file: webhook_handler.ts:62 ~ promises ~ result:', result);
                    //enable when testing on lambda
                    yield eventResultHandler(result, event.replyToken);
                    return result;
                }
                else {
                    console.log('Event does not have a replyToken:', event);
                    return false;
                }
            }
            catch (error) {
                console.error('Error in webhookEventHandler:', error);
                return false;
            }
        }));
        const results = [];
        try {
            for (const promise of promises) {
                try {
                    const result = yield promise;
                    results.push(result);
                }
                catch (error) {
                    console.error('Error in promise:', error);
                }
            }
        }
        catch (error) {
            console.error('Error in processing promises:', error);
        }
        console.log('Results of all promises including nested objects:', JSON.stringify(results, null, 2));
    });
}
exports.webhookHandler = webhookHandler;
function webhookEventHandler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the event type is "message"
        if (event.type === 'message') {
            if (event.source.type === 'user') {
                if ('text' in event.message && event.message.text) {
                    console.log('User Message event received');
                    try {
                        const result = yield (0, message_event_handler_1.messageEventHandler)({
                            user_line_id: event.source.userId,
                            text: event.message.text,
                            timestamp: event.timestamp,
                        });
                        return result;
                    }
                    catch (error) {
                        console.error('Error in messageEventHandler:', error);
                        return { user: null, succeed: false };
                    }
                }
                else {
                    console.log('User Message event received but no text, perhaps an StickerMessageEvent');
                    return { user: null, succeed: false };
                }
            }
            else {
                console.log('Non-user event received');
                return { user: null, succeed: false };
            }
        }
        else {
            // TODO: Handle non-message event
            console.log('Non-message event received');
            return { user: null, succeed: false };
        }
    });
}
exports.webhookEventHandler = webhookEventHandler;
