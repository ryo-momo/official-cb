class MessageHelper {
    // Simple message object
    createSimpleMessage(text) {
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
        return {
            type: 'flex',
            altText: altText,
            contents: contents
        };
    }


//------- Interface methods ---------------

    // Create a message object with quick reply
    // If no items are passed, generate a simple text object
    createMessage(text, quickReplyItems) {
        if (quickReplyItems && quickReplyItems.length > 0) {
            return {
                type: 'text',
                text: text,
                quickReply: {
                    items: quickReplyItems
                }
            };
        } else {
            // Log: No items provided, generating a simple text object
            console.log("No items provided for quick reply, generating a simple text object");
            return {
                type: 'text',
                text: text
            };
        }
    }

    // Generate Flex Message with Quick Replies
    createFlexMessageWithQuickReplies(altText, contents, quickReplyItems) {
        // Create the base flex message
        let flexMessage = this.createFlexMessage(altText, contents);
        // If quickReplyItems are provided, add them to the flex message
        if (quickReplyItems && quickReplyItems.length > 0) {
            flexMessage.quickReply = {
                items: quickReplyItems
            };
        } else {
            // Log: No quick reply items provided, generating a standard flex message
            console.log("No quick reply items provided, generating a standard flex message");
        }
        return flexMessage;
    }
}

module.exports = MessageHelper;



