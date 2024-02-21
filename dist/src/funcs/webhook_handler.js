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
exports.webhookHandler = exports.webhookEventHandler = void 0;
const text_message_event_handler_1 = require("./text_message_event_handler");
const message_sender_1 = require("./message_sender");
const dotenv_1 = __importDefault(require("dotenv"));
const follow_event_handler_1 = require("./follow_event_handler");
const DatabaseCommunicator_1 = require("../classes/DatabaseCommunicator");
const config_1 = require("../data/config");
dotenv_1.default.config();
const eventResultHandler = (result, reply_token) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.CHANNEL_ACCESS_TOKEN) {
        const ms = new message_sender_1.MessageSender(process.env.CHANNEL_ACCESS_TOKEN);
        if (result.user) {
            if (result.user.response.message) {
                try {
                    console.log('sending user a response');
                    yield ms.validateAndSendReplyMessage(reply_token, result.user.response.message);
                }
                catch (err) {
                    console.error('Error in sending message:', err);
                }
                if (result.user.current_action_id !== null &&
                    result.user.detour_action_id === null) {
                    console.log('saving last message');
                    const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
                    try {
                        yield dbc.connect();
                        yield dbc.saveLastMessage(result.user.user_line_id, result.user.response.message);
                    }
                    catch (error) {
                        console.error('Error in saving last message:', error);
                    }
                    finally {
                        void dbc.disconnect();
                    }
                }
            }
        }
        else {
            console.log('No user object found in result');
        }
    }
    else {
        console.log('No channel access token found');
    }
});
const webhookEventHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the event type is "message"
    console.log(`Received an event: ${event.type}`);
    switch (event.type) {
        case 'message':
            if (event.source.type === 'user') {
                if ('text' in event.message && event.message.text) {
                    console.log('User Message event received');
                    try {
                        const result = yield (0, text_message_event_handler_1.textMessageEventHandler)(event);
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
        case 'follow':
            return yield (0, follow_event_handler_1.followEventHandler)(event);
        default:
            console.log('Received an unsupported event');
            return { user: null, succeed: false };
    }
});
exports.webhookEventHandler = webhookEventHandler;
const webhookHandler = (request_body) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = request_body.events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if ('replyToken' in event) {
                const result = yield (0, exports.webhookEventHandler)(event);
                //enable when testing on lambda
                yield eventResultHandler(result, event.replyToken);
                return result;
            }
            else {
                // TODO need to send message to the user
                console.log('Event does not have a replyToken:', event);
                return { user: null, succeed: false };
            }
        }
        catch (error) {
            //TODO need to send message to the user
            console.error('Error in webhookEventHandler:', error);
            return { user: null, succeed: false };
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
exports.webhookHandler = webhookHandler;
