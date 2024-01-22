const messageEventHandler = require('./message_event_handler');

//example of LINE event

// {
//     "destination": "Ude07b1faacabdf9fc4971644c94fd76d",
//     "events": [
//         {
//             "type": "message",
//             "message": {
//                 "type": "text",
//                 "id": "489235210962207227",
//                 "quoteToken": "L9RsBpEYLH9GOcYH7b0Jf3tFzFuqmihcOFK6-SIgxjkfY6JVfw3cthFToNt02REUPD6zDOZ-iYIZdv3nhuAowKIcx19e6uEMDxzrObD4hy3TfMSS-B0bIaNXC7Ty2X4Dte2KRe37IvR5_bx75ehEnQ",
//                 "text": "Aaa"
//             },
//             "webhookEventId": "01HKC6YB99P4X1WA0GQHMZQPMQ",
//             "deliveryContext": {
//                 "isRedelivery": false
//             },
//             "timestamp": 1704438213713,
//             "source": {
//                 "type": "user",
//                 "userId": "Ue478ad4286f7e7b0d2baf5e39bdb9908"
//             },
//             "replyToken": "c76fd232a2104b689cc90a38a75defe3",
//             "mode": "active"
//         }
//     ]
// }

function webhookHandler(body){
    // Convert body to a JavaScript object
    let data = JSON.parse(body);

    // Iterate over each event in data.events
    data.events.forEach(event => {
        // Check if the event type is "message"
        if (event.type === "message") {
            return messageEventHandler({
                user_line_id: event.source.userId,
                text: event.message.text,
                timestamp: event.timestamp
            });
        } else {
            // TODO: Handle non-message event
            return null;
        }
    });
}