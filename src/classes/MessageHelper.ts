export interface QuickReplyOption {
    type: string;
    action: {
        type: string;
        label: string;
        text: string;
    };
}

export interface Message {
    type: 'text';
    text: string;
    quickReply?: {
        items: QuickReplyOption[];
    };
}

export interface FlexMessage {
    type: 'flex';
    altText: string;
    contents: string;
    quickReply?: {
        items: QuickReplyOption[];
    };
}

export class MessageHelper {
    // Simple message object
    createSimpleMessage(text: string): Message {
        if (typeof text !== 'string') {
            throw new Error('Invalid argument: text must be a string');
        }
        return {
            type: 'text',
            text: text,
        };
    }

    // Generate quick reply items
    generateQuickReplyItems(options: QuickReplyOption[]): QuickReplyOption[] {
        return options.map((option) => ({
            type: 'action',
            action: {
                type: 'message',
                label: option.action.label,
                text: option.action.text,
            },
        }));
    }

    // Flex message object
    createFlexMessage(altText: string, contents: string, text?: string): FlexMessage {
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

    // Add quick reply items to a message object
    addQuickReplyItems(
        message: Message | FlexMessage,
        quickReplyItems: QuickReplyOption[]
    ): Message | FlexMessage {
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
        } else {
            // Log: No items provided, generating a simple text object
            console.log('No items provided for quick reply, generating a simple text object');
        }
        return message;
    }

    // Create a message object with quick reply
    createMessageWithQuickReplies(text: string, quickReplyItems: QuickReplyOption[]): Message {
        const message: Message = {
            type: 'text',
            text: text,
        };
        return this.addQuickReplyItems(message, quickReplyItems) as Message;
    }

    // Generate Flex Message with Quick Replies
    createFlexMessageWithQuickReplies(
        altText: string,
        contents: string,
        quickReplyItems: QuickReplyOption[]
    ): FlexMessage {
        const flexMessage = this.createFlexMessage(altText, contents);
        return this.addQuickReplyItems(flexMessage, quickReplyItems) as FlexMessage;
    }
}
