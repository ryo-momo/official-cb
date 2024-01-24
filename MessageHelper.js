class MessageHelper {
    // Simple message object
    createSimpleMessage(text) {
        if (typeof text !== 'string') {
            throw new Error('Invalid argument: text must be a string');
        }
        return {
            type: 'text',
            text: text
        };
    }

    // Generate quick reply items
    generateQuickReplyItems(options) {
        return options.map(option => ({
            type: 'action',
            action: {
                type: 'message',
                label: option.label,
                text: option.text
            }
        }));
    }

    // Flex message object
    createFlexMessage(altText, contents) {
        if (typeof altText !== 'string') {
            throw new Error('Invalid argument: altText must be a string');
        }
        if (!Array.isArray(contents)) {
            throw new Error('Invalid argument: contents must be an array');
        }
        return {
            type: 'flex',
            altText: altText,
            contents: contents
        };
    }

    // Add quick reply items to a message object
    addQuickReplyItems(message, quickReplyItems) {
        if (typeof message !== 'object') {
            throw new Error('Invalid argument: message must be an object');
        }
        if (quickReplyItems && !Array.isArray(quickReplyItems)) {
            throw new Error('Invalid argument: quickReplyItems must be an array');
        }
        if (quickReplyItems && quickReplyItems.length > 0) {
            message.quickReply = {
                items: quickReplyItems
            };
        } else {
            // Log: No items provided, generating a simple text object
            console.log("No items provided for quick reply, generating a simple text object");
        }
        return message;
    }

    //------- Interface methods ---------------

    // Create a message object with quick reply
    // If no items are passed, generate a simple text object
    createMessage(text, quickReplyItems) {
        let message = {
            type: 'text',
            text: text
        };
        return this.addQuickReplyItems(message, quickReplyItems);
    }

    // Generate Flex Message with Quick Replies
    createFlexMessageWithQuickReplies(altText, contents, quickReplyItems) {
        // Create the base flex message
        let flexMessage = this.createFlexMessage(altText, contents);
        return this.addQuickReplyItems(flexMessage, quickReplyItems);
    }
}

module.exports = MessageHelper;
