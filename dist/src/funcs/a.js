'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.imageMessageHandler = exports.handler = void 0;
const client_s3_1 = require('@aws-sdk/client-s3');
const stream_1 = require('stream');
const https_1 = __importDefault(require('https'));
const s3 = new client_s3_1.S3();
const lineAPIToken =
    'JtMKGIsp5JJvfWrZUvqSruC7TEvVfhgTC6wFOQtmXtNmA5gZrgefZlw4gIUznwDeVuqTnqYOn+Hd7XwXIkm/A2/XKSOO7hXnlpFI2PagAVJQH1ni8kGXUFc96rsleA5qpbp3Jfa3EGO2NV+ZcpwZKgdB04t89/1O/w1cDnyilFU=';
const s3Bucket = 'official-cb-imagestorage-staging';
const forward_image_to_line_id = 'Ue478ad4286f7e7b0d2baf5e39bdb9908';
// export const handler = async (event: unknown): Promise<Buffer> => {
//     console.log('event received is: ', JSON.stringify(event));
//     //const userId = event.events[0].source.userId;
//     const userId = 'U1d84e21f92e1f17b23c6100f4e53d226';
//     //const imageId = event.events[0].message.id;
//     const imageId = '494875572301201955';
//     //const imageUrl = await storeImageToS3(userId,imageId);
//     //const imageUrl = "https://trialbucketforimage.s3.ap-northeast-1.amazonaws.com/U1d84e21f92e1f17b23c6100f4e53d226/494875572301201955.jpg"
//     //return await sendImageToUser(userId,imageUrl);
//     //return imageUrl;
//     const image = await getImageFromS3(userId, imageId);
//     return image;
// };
const handler = (event) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const messageEvent = event.events[0];
        if (messageEvent.type === 'message') {
            try {
                yield (0, exports.imageMessageHandler)(messageEvent);
            } catch (err) {
                console.error(err);
            }
        }
    });
exports.handler = handler;
const imageMessageHandler = (event) =>
    __awaiter(void 0, void 0, void 0, function* () {
        console.log('event received: ', JSON.stringify(event));
        if (event.message.type === 'image') {
            const user_line_id = event.source.userId;
            const image_id = event.message.id;
            if (user_line_id) {
                let image_url = ''; // image_urlの定義を追加
                try {
                    image_url = yield storeImageToS3(user_line_id, image_id); // image_urlに値を代入
                    console.log('store image to s3 success');
                } catch (err) {
                    console.log('Error storing image to S3:', err);
                }
                if (image_url) {
                    // image_urlが空でないことを確認
                    try {
                        yield sendImageToUser(forward_image_to_line_id, image_url);
                        console.log('send image to user success');
                    } catch (err) {
                        console.log('Error sending image to user:', err);
                    }
                }
            }
        }
    });
exports.imageMessageHandler = imageMessageHandler;
const storeImageToS3 = (lineId, imageId) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            hostname: 'api-data.line.me',
            path: `/v2/bot/message/${imageId}/content`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${lineAPIToken}`,
            },
        };
        try {
            const { data: imageData, contentType } = yield httpsRequestforimage(options);
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
            // const uploadResult = await s3.upload(params).promise();
            // console.log('Image uploaded successfully:', uploadResult.Location);
            // return uploadResult.Location;
            yield s3.putObject(params);
            console.log(
                'Image uploaded successfully:',
                `https://${s3Bucket}.s3.amazonaws.com/${lineId}/${imageId}.jpg`
            );
            return `https://${s3Bucket}.s3.amazonaws.com/${lineId}/${imageId}.jpg`;
        } catch (error) {
            console.log('Error handling:', error);
            throw error;
        }
    });
const getImageFromS3 = (lineId, imageId) =>
    __awaiter(void 0, void 0, void 0, function* () {
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
                    Body.on('data', (chunk) =>
                        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
                    );
                    Body.on('end', () => resolve(Buffer.concat(chunks)));
                    Body.on('error', reject);
                });
            } else {
                throw new Error('Expected data.Body to be a stream');
            }
        } catch (error) {
            console.error('Error retrieving image from S3:', error);
            throw error;
        }
    });
const sendImageToUser = (lineId, imageUrl) =>
    __awaiter(void 0, void 0, void 0, function* () {
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
                Authorization: `Bearer ${lineAPIToken}`,
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
                        } else {
                            console.error(
                                'sendImageToUser - Request failed. Status code:',
                                statusCode
                            );
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
        } catch (error) {
            if (error instanceof Error) {
                console.error('sendImageToUser - Error:', error.message);
            } else {
                console.error('sendImageToUser - An unexpected error occurred');
            }
            throw error;
        }
    });
const httpsRequestforimage = (options) =>
    __awaiter(void 0, void 0, void 0, function* () {
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
                    console.log('Response Body:', data.toString());
                    resolve({ data, contentType });
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.end();
        });
    });
const httpsRequest = (options, body, functionName) =>
    __awaiter(void 0, void 0, void 0, function* () {
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
                    } else {
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
