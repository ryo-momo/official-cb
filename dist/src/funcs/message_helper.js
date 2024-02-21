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
exports.setLastMessage = exports.organizeQRs = exports.addQuickReplyItems = exports.createFlexMessage = exports.generateQuickReplyItems = void 0;
const DatabaseCommunicator_1 = require("../classes/DatabaseCommunicator");
const config_1 = require("../data/config");
// export interface QuickReplyOption {
//     type: string;
//     action: {
//         type: string;
//         label: string;
//         text: string;
//     };
// }
// export interface Message {
//     type: 'text';
//     text: string;
//     quickReply?: {
//         items: QuickReplyOption[];
//     };
// }
// export interface FlexMessage {
//     type: 'flex';
//     altText: string;
//     contents: string;
//     quickReply?: {
//         items: QuickReplyOption[];
//     };
// }
// // Simple message object
// export const createSimpleMessage = (text: string): Message => {
//     if (typeof text !== 'string') {
//         throw new Error('Invalid argument: text must be a string');
//     }
//     return {
//         type: 'text',
//         text: text,
//     };
// };
// Generate quick reply items
const generateQuickReplyItems = (options) => options.map((option) => ({
    type: 'action',
    action: {
        type: 'message',
        label: option.text,
        text: option.text,
    },
}));
exports.generateQuickReplyItems = generateQuickReplyItems;
// Flex message object
const createFlexMessage = (altText, contents, text) => {
    if (typeof altText !== 'string') {
        throw new Error('Invalid argument: altText must be a string');
    }
    if (!Array.isArray(contents)) {
        throw new Error('Invalid argument: contents must be an array');
    }
    return {
        type: 'flex',
        altText: altText,
        contents: contents,
    };
};
exports.createFlexMessage = createFlexMessage;
// Add quick reply items to a message object
const addQuickReplyItems = (message, quickReplyItems) => {
    if (typeof message !== 'object') {
        throw new Error('Invalid argument: message must be an object');
    }
    if (quickReplyItems && !Array.isArray(quickReplyItems)) {
        throw new Error('Invalid argument: quickReplyItems must be an array');
    }
    if (quickReplyItems && quickReplyItems.length > 0) {
        message.quickReply = {
            items: quickReplyItems,
        };
    }
    else {
        // Log: No items provided, generating a simple text object
        console.log('No items provided for quick reply, generating a simple text object');
    }
    return message;
};
exports.addQuickReplyItems = addQuickReplyItems;
// // Create a message object with quick reply
// export const createMessageWithQuickReplies = (
//     text: string,
//     quickReplyItems: QuickReplyOption[]
// ): Message => {
//     const message: Message = {
//         type: 'text',
//         text: text,
//     };
//     return addQuickReplyItems(message, quickReplyItems) as Message;
// };
// // Generate Flex Message with Quick Replies
// export const createFlexMessageWithQuickReplies = (
//     altText: string,
//     contents: string,
//     quickReplyItems: QuickReplyOption[]
// ): FlexMessage => {
//     const flex_message = createFlexMessage(altText, contents);
//     return addQuickReplyItems(flex_message, quickReplyItems) as FlexMessage;
// };
const reduceDuplicateQROptions = (messages) => messages.map((message, index) => {
    if (index === messages.length - 1 &&
        message.quickReply &&
        message.quickReply.items.length > 0) {
        const uniqueItems = [];
        const labels = new Set();
        for (const item of message.quickReply.items) {
            if (!labels.has(item.action.label)) {
                uniqueItems.push(item);
                labels.add(item.action.label);
            }
            else {
                // Log: Found duplicate quickReplyItem, removing it
                console.log(`Found duplicate quickReplyItem with label: ${item.action.label}, removing it`);
            }
        }
        message.quickReply.items = uniqueItems;
    }
    return message;
});
const slideQRsToLast = (messages) => {
    // Slide all quickReplies to the last message and remove from others
    if (messages.length > 1) {
        let allQuickReplies = [];
        messages.forEach((message, index) => {
            if (message.quickReply) {
                allQuickReplies = allQuickReplies.concat(message.quickReply.items);
                if (index !== messages.length - 1) {
                    // Remove quickReply from all but the last message
                    delete message.quickReply;
                }
            }
        });
        // Add all collected quickReplies to the last message
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage.quickReply) {
            lastMessage.quickReply = { items: [] };
        }
        lastMessage.quickReply.items = allQuickReplies;
    }
    return messages;
};
const organizeQRs = (user) => {
    if (user.response.message) {
        user.response.message = reduceDuplicateQROptions(user.response.message);
        user.response.message = slideQRsToLast(user.response.message);
    }
};
exports.organizeQRs = organizeQRs;
const setLastMessage = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
    const last_message = yield dbc.getLastMessage(user.user_line_id);
    if (last_message) {
        user.response.message.push(...last_message);
    }
});
exports.setLastMessage = setLastMessage;
