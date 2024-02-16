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
exports.lambdaHandler = void 0;
const webhook_handler_1 = require("../funcs/webhook_handler");
const lambdaHandler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received event:', JSON.stringify(event));
        if ('detail-type' in event) {
            console.log('Scheduled Invocation');
        }
        else {
            yield (0, webhook_handler_1.webhookHandler)(event);
        }
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
});
exports.lambdaHandler = lambdaHandler;
//TODO 5分ごとに起動するやつ実装
//TODO 任意の情報を更新するやつ実装
