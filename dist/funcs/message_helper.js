"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFlexMessageWithQuickReplies = exports.createMessageWithQuickReplies = exports.addQuickReplyItems = exports.createFlexMessage = exports.generateQuickReplyItems = exports.createSimpleMessage = void 0;
// Simple message object
function createSimpleMessage(text) {
    if (typeof text !== 'string') {
        throw new Error('Invalid argument: text must be a string');
    }
    return {
        type: 'text',
        text: text,
    };
}
exports.createSimpleMessage = createSimpleMessage;
// Generate quick reply items
function generateQuickReplyItems(options) {
    return options.map((option) => ({
        type: 'action',
        action: {
            type: 'message',
            label: option.text,
            text: option.text,
        },
    }));
}
exports.generateQuickReplyItems = generateQuickReplyItems;
// Flex message object
function createFlexMessage(altText, contents, text) {
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
}
exports.createFlexMessage = createFlexMessage;
// Add quick reply items to a message object
function addQuickReplyItems(message, quickReplyItems) {
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
}
exports.addQuickReplyItems = addQuickReplyItems;
// Create a message object with quick reply
function createMessageWithQuickReplies(text, quickReplyItems) {
    const message = {
        type: 'text',
        text: text,
    };
    return addQuickReplyItems(message, quickReplyItems);
}
exports.createMessageWithQuickReplies = createMessageWithQuickReplies;
// Generate Flex Message with Quick Replies
function createFlexMessageWithQuickReplies(altText, contents, quickReplyItems) {
    const flexMessage = createFlexMessage(altText, contents);
    return addQuickReplyItems(flexMessage, quickReplyItems);
}
exports.createFlexMessageWithQuickReplies = createFlexMessageWithQuickReplies;
