"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFlexMessageWithQuickReplies = exports.createMessageWithQuickReplies = exports.addQuickReplyItems = exports.createFlexMessage = exports.generateQuickReplyItems = exports.createSimpleMessage = void 0;
// Simple message object
const createSimpleMessage = (text) => {
    if (typeof text !== 'string') {
        throw new Error('Invalid argument: text must be a string');
    }
    return {
        type: 'text',
        text: text,
    };
};
exports.createSimpleMessage = createSimpleMessage;
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
// Create a message object with quick reply
const createMessageWithQuickReplies = (text, quickReplyItems) => {
    const message = {
        type: 'text',
        text: text,
    };
    return (0, exports.addQuickReplyItems)(message, quickReplyItems);
};
exports.createMessageWithQuickReplies = createMessageWithQuickReplies;
// Generate Flex Message with Quick Replies
const createFlexMessageWithQuickReplies = (altText, contents, quickReplyItems) => {
    const flex_message = (0, exports.createFlexMessage)(altText, contents);
    return (0, exports.addQuickReplyItems)(flex_message, quickReplyItems);
};
exports.createFlexMessageWithQuickReplies = createFlexMessageWithQuickReplies;
