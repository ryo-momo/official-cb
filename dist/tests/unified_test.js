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
exports.CHANNEL_ACCESS_TOKEN = void 0;
const index_1 = require("../src/main/index");
exports.CHANNEL_ACCESS_TOKEN = 'JtMKGIsp5JJvfWrZUvqSruC7TEvVfhgTC6wFOQtmXtNmA5gZrgefZlw4gIUznwDeVuqTnqYOn+Hd7XwXIkm/A2/XKSOO7hXnlpFI2PagAVJQH1ni8kGXUFc96rsleA5qpbp3Jfa3EGO2NV+ZcpwZKgdB04t89/1O/w1cDnyilFU=';
const request_body = {
    destination: 'Ude07b1faacabdf9fc4971644c94fd76d',
    events: [
        {
            type: 'message',
            message: {
                type: 'text',
                id: '489235210962207227',
                quoteToken: 'L9RsBpEYLH9GOcYH7b0Jf3tFzFuqmihcOFK6-SIgxjkfY6JVfw3cthFToNt02REUPD6zDOZ-iYIZdv3nhuAowKIcx19e6uEMDxzrObD4hy3TfMSS-B0bIaNXC7Ty2X4Dte2KRe37IvR5_bx75ehEnQ',
                text: '>お客様情報',
            },
            webhookEventId: '01HKC6YB99P4X1WA0GQHMZQPMQ',
            deliveryContext: {
                isRedelivery: false,
            },
            timestamp: 1704438213713,
            source: {
                type: 'user',
                userId: 'Ue478ad4286f7e7b0d2baf5e39bdb9908',
            },
            replyToken: 'c76fd232a2104b689cc90a38a75defe3',
            mode: 'active',
        },
    ],
};
await (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, index_1.lambdaHandler)(request_body, null);
    }
    catch (err) {
        console.error('Error in webhookHandler: ', err);
    }
}))();
//TODO 郵便番号が'1j'で通った^^;
