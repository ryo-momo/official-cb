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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageMessageHandler = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const stream_1 = require("stream");
const https_1 = __importDefault(require("https"));
const dotenv_1 = __importDefault(require("dotenv"));
// //just for testing
// export const handler = async (event: WebhookRequestBody): Promise<void> => {
//     const messageEvent = event.events[0];
//     if (messageEvent.type === 'message') {
//         try {
//             await imageMessageHandler(messageEvent, user_line_id);
//         } catch (err) {
//             console.error(err);
//         }
//     }
// };
dotenv_1.default.config();
//handler to handle image message event
const imageMessageHandler = (message, user) => __awaiter(void 0, void 0, void 0, function* () {
    const forward_image_to_line_id = process.env.STAFF_LINE_ID;
    console.log('event received: ', JSON.stringify(message));
    if (message.type === 'image') {
        const image_id = message.id;
        const user_line_id = user.user_line_id;
        if (user_line_id) {
            let image_url = '';
            // store the image sent to S3
            try {
                image_url = yield storeImageToS3(user_line_id, image_id); // image_urlに値を代入
                console.log('store image to s3 success');
            }
            catch (err) {
                console.log('Error storing image to S3:', err);
            }
            if (image_url) {
                // image_urlが空でないことを確認
                try {
                    if (forward_image_to_line_id) {
                        yield sendImageToUser(forward_image_to_line_id, image_url);
                    }
                    console.log('send image to user success');
                }
                catch (err) {
                    console.error('Error sending image to user:', err);
                }
            }
            else {
                console.error('image url is empty');
            }
        }
        else {
            console.error('no line id found in message event');
        }
    }
});
exports.imageMessageHandler = imageMessageHandler;
const storeImageToS3 = (lineId, imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const s3 = new client_s3_1.S3();
    const s3Bucket = process.env.IMAGE_STORE_BUCKET;
    const channel_access_token = process.env.CHANNEL_ACCESS_TOKEN;
    const options = {
        hostname: 'api-data.line.me',
        path: `/v2/bot/message/${imageId}/content`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${channel_access_token}`,
        },
    };
    try {
        const { data: imageData, contentType } = yield httpsRequestForImage(options);
        console.log('ContentType: ', contentType);
        console.log('Image data length', imageData.length);
        const params = {
            Bucket: s3Bucket,
            Key: `${lineId}/${imageId}.jpg`,
            Body: imageData,
            ContentType: contentType,
            Metadata: {
                userId: lineId,
            },
        };
        yield s3.putObject(params);
        console.log('Image uploaded successfully:', `https://${s3Bucket}.s3.amazonaws.com/${lineId}/${imageId}.jpg`);
        return `https://${s3Bucket}.s3.amazonaws.com/${lineId}/${imageId}.jpg`;
    }
    catch (error) {
        console.log('Error handling:', error);
        throw error;
    }
});
const getImageFromS3 = (lineId, imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const s3 = new client_s3_1.S3();
    const s3Bucket = process.env.IMAGE_STORE_BUCKET;
    const params = {
        Bucket: s3Bucket,
        Key: `${lineId}/${imageId}.jpg`,
    };
    try {
        const { Body } = yield s3.getObject(params);
        if (Body instanceof stream_1.Readable) {
            // Node.jsのReadable Streamの場合
            return new Promise((resolve, reject) => {
                const chunks = [];
                Body.on('data', (chunk) => chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk));
                Body.on('end', () => resolve(Buffer.concat(chunks)));
                Body.on('error', reject);
            });
        }
        else {
            throw new Error('Expected data.Body to be a stream');
        }
    }
    catch (error) {
        console.error('Error retrieving image from S3:', error);
        throw error;
    }
});
const sendImageToUser = (lineId, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const channel_access_token = process.env.CHANNEL_ACCESS_TOKEN;
    const message = {
        type: 'image',
        originalContentUrl: imageUrl,
        previewImageUrl: imageUrl,
    };
    const postData = JSON.stringify({
        to: lineId,
        messages: [message],
    });
    const options = {
        hostname: 'api.line.me',
        path: '/v2/bot/message/push',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${channel_access_token}`,
        },
    };
    try {
        const response = yield new Promise((resolve, reject) => {
            const req = https_1.default.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    const statusCode = res.statusCode || 500;
                    if (statusCode >= 200 && statusCode < 300) {
                        console.log('sendImageToUser - Request successful.');
                        console.log('sendImageToUser - Response:', data);
                        resolve({ statusCode, data });
                    }
                    else {
                        console.error('sendImageToUser - Request failed. Status code:', statusCode);
                        console.error('sendImageToUser - Response:', data);
                        reject(new Error(`Request failed with status code: ${statusCode}`));
                    }
                });
            });
            req.on('error', (error) => {
                console.error('sendImageToUser - Error:', error.message);
                reject(error);
            });
            req.write(postData);
            req.end();
        });
        console.log('sendImageToUser - Response:', response.data);
        return 'Image sent successfully';
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('sendImageToUser - Error:', error.message);
        }
        else {
            console.error('sendImageToUser - An unexpected error occurred');
        }
        throw error;
    }
});
const httpsRequestForImage = (options) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(options, (res) => {
            const chunks = [];
            let contentType;
            // Get the Content-Type from the response headers
            if (res.headers['content-type']) {
                contentType = res.headers['content-type'];
            }
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                const data = Buffer.concat(chunks);
                console.log('res whole body: ', res);
                console.log('Response Status Code:', res.statusCode);
                resolve({ data, contentType });
            });
        });
        req.on('error', (error) => {
            reject(error);
        });
        req.end();
    });
});
const httpsRequest = (options, body, functionName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const statusCode = res.statusCode || 500;
                if (statusCode >= 200 && statusCode < 300) {
                    console.log(`${functionName} - Request successful.`);
                    console.log(`${functionName} - Response:`, data);
                    resolve({ statusCode, data });
                }
                else {
                    console.error(`${functionName} - Request failed. Status code:`, statusCode);
                    console.error(`${functionName} - Response:`, data);
                    reject(new Error(`Request failed with status code: ${statusCode}`));
                }
            });
        });
        req.on('error', (error) => {
            console.error(`${functionName} - Error:`, error.message);
            reject(error);
        });
        if (body) {
            req.write(body);
        }
        req.end();
    });
});
