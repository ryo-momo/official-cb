const webhookHandler = require("./webhook_handler")

const YOUR_CHANNEL_ACCESS_TOKEN = "1i8dcuhxOTmw8SXwhH25YLoAkW/tJgfug7rIpeIMlTGQXDbVjlBliOGBjPghAwpjVuqTnqYOn+Hd7XwXIkm/A2/XKSOO7hXnlpFI2PagAVIOt0NkyPbJKpRvbgQMv0QX5PPZOpT28yS7mIN0dsmctwdB04t89/1O/w1cDnyilFU="

const request_body = {
    destination: "Ude07b1faacabdf9fc4971644c94fd76d",
    events: [
        {
            type: "message",
            message: {
                type: "text",
                id: "489235210962207227",
                quoteToken: "L9RsBpEYLH9GOcYH7b0Jf3tFzFuqmihcOFK6-SIgxjkfY6JVfw3cthFToNt02REUPD6zDOZ-iYIZdv3nhuAowKIcx19e6uEMDxzrObD4hy3TfMSS-B0bIaNXC7Ty2X4Dte2KRe37IvR5_bx75ehEnQ",
                text: ">お客様情報の登録/変更"
            },
            webhookEventId: "01HKC6YB99P4X1WA0GQHMZQPMQ",
            deliveryContext: {
                isRedelivery: false
            },
            timestamp: 1704438213713,
            source: {
                type: "user",
                userId: "Ue478ad4286f7e7b0d2baf5e39bdb9908"
            },
            replyToken: "c76fd232a2104b689cc90a38a75defe3",
            mode: "active"
        }
    ]
};

(async () => {
    const user = await webhookHandler(request_body);
    console.log("User is", user);
})();
