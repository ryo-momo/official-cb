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
exports.DatabaseCommunicator = void 0;
const mysql_1 = __importDefault(require("mysql"));
const config_1 = require("../data/config");
const User_1 = require("./User");
//basically for database querying
const extractUserData = (user) => ({
    user_id: user.user_id,
    user_line_id: user.user_line_id,
    major_state_id: user.major_state_id,
    minor_state_id: user.minor_state_id,
    current_action_id: user.current_action_id,
    detour_action_id: user.detour_action_id,
    current_survey_id: user.current_survey_id,
    current_step_id: user.current_step_id,
    detour_step_id: user.detour_step_id,
    current_question_id: user.current_question_id,
    //null if the answer[] is empty
    current_answers: user.current_answers,
});
class DatabaseCommunicator {
    constructor(db_connection_data) {
        this.db_connection_data = db_connection_data;
        this.db_data = config_1.db_data;
        this.connection = null;
    }
    // Method to establish connection with the database
    connect() {
        return new Promise((resolve, reject) => {
            if (!this.connection || this.connection.state === 'disconnected') {
                this.connection = mysql_1.default.createConnection({
                    host: this.db_connection_data.host,
                    user: this.db_connection_data.user,
                    password: this.db_connection_data.password,
                    database: this.db_connection_data.database,
                    connectTimeout: 30000,
                });
                // Add error handling for connection
                this.connection.connect((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
            else {
                resolve();
            }
        });
    }
    // Method to disconnect from the database
    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.connection && this.connection.state !== 'disconnected') {
                this.connection.end((err) => {
                    if (err) {
                        console.error('Error disconnecting from the database: ', err);
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
            else {
                resolve();
            }
        });
    }
    // Method to execute a query on the database
    // sql: SQL query string (e.g., "SELECT * FROM users")
    // args: Array of arguments to be passed to the SQL query (e.g., [userId])
    query(sql, args) {
        return new Promise((resolve, reject) => {
            if (this.connection) {
                this.connection.query(sql, args, (err, rows) => {
                    if (err) {
                        console.error('Error executing query: ', err);
                        return reject(err);
                    }
                    resolve(rows);
                });
            }
            else {
                const error = new Error('Database connection is null.');
                console.error('Error executing query: ', error);
                reject(error);
            }
        });
    }
    // Method to read from the database
    // table: Name of the table to read from (e.g., "users")
    // columns: Array of column names to select (e.g., ["id", "name"])
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    read(table, columns, condition) {
        const sql = `SELECT ${columns.join(', ')} FROM ?? WHERE ${condition}`;
        const args = [table];
        return this.query(sql, args);
    }
    // Method to write to the database
    // table: Name of the table to write to (e.g., "users")
    // data: Object where keys are column names and values are the corresponding data to insert (e.g., {name: "John", age: 30})
    write(table, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const sql = `INSERT INTO ?? (${columns.join(', ')}) VALUES (?)`;
        const args = [table, values];
        return this.query(sql, args);
    }
    // Method to update the database
    // table: Name of the table to update (e.g., "users")
    // data: Object where keys are column names and values are the new values to set (e.g., {name: "John", age: 31})
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    update(table, data, condition) {
        const updates = Object.entries(data)
            .map(([column]) => `${column} = ?`)
            .join(', ');
        const sql = `UPDATE ?? SET ${updates} WHERE ${condition}`;
        const args = [table, ...Object.values(data)];
        return this.query(sql, args);
    }
    // Method to delete from the database
    // table: Name of the table to delete from (e.g., "users")
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    delete(table, condition) {
        const sql = `DELETE FROM ?? WHERE ${condition}`;
        const args = [table];
        return this.query(sql, args);
    }
    // ------- User Methods -------
    getLastMessage(user_line_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const sql = `SELECT last_message_cache FROM users WHERE user_line_id = ?`;
            const args = [user_line_id];
            const rows = (yield this.query(sql, args));
            yield this.disconnect();
            if (rows.length > 0) {
                return JSON.parse(rows[0].last_message_cache); // JSON文字列をJSオブジェクトに変換
            }
            else {
                return null;
            }
        });
    }
    saveLastMessage(user_line_id, objectData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const jsonData = JSON.stringify(objectData); // オブジェクトをJSON文字列に変換
            const sql = `UPDATE users SET last_message_cache = ? WHERE user_line_id = ?`;
            const args = [jsonData, user_line_id];
            yield this.query(sql, args);
            yield this.disconnect();
        });
    }
    // Method to check if a user exists in the database
    // user: User object with a user_id property
    userExists(user_line_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const sql = `SELECT EXISTS(SELECT 1 FROM users WHERE user_line_id = ?) AS user_exists`;
            const args = [user_line_id];
            const rows = (yield this.query(sql, args));
            yield this.disconnect();
            return rows[0].user_exists === 1;
        });
    }
    // searches user by LINE ID and
    // returns an object with user class object properties
    getUserByLineId(user_line_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const table_name = config_1.db_data.tables.users.name;
            const columns = User_1.db_references;
            const columns_string = Object.keys(columns).toString();
            const sql = `SELECT ${columns_string} FROM \`${table_name}\` WHERE user_line_id = ?`;
            const args = [user_line_id];
            const rows = (yield this.query(sql, args));
            yield this.disconnect();
            if (rows.length > 0) {
                if (typeof rows[0].current_answers === 'string') {
                    rows[0].current_answers = rows[0].current_answers.split(',');
                }
                return rows[0];
            }
            else {
                return null;
            }
        });
    }
    // gets user info by LINE ID and
    // returns an object with user_info_columns properties
    getInfoByUserId(user_id, data_locations) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const queries = Object.values(data_locations).map((location) => __awaiter(this, void 0, void 0, function* () {
                const table_name = location.table_name;
                const columns = Object.keys(location.columns).join(', ');
                const sql = `SELECT ${columns} FROM \`${table_name}\` WHERE user_id = ?`;
                const args = [user_id];
                return this.query(sql, args);
            }));
            const results = yield Promise.all(queries);
            yield this.disconnect();
            if (results.flat().length > 0) {
                // 結果を一つのオブジェクトにまとめる
                const aggregated_results = results
                    .flat()
                    .reduce((acc, row) => {
                    Object.keys(row).forEach((key) => {
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push(row[key]);
                    });
                    return acc;
                }, {});
                // 各キーの値が配列になっているオブジェクトを返す
                const final_result = Object.keys(aggregated_results).reduce((acc, key) => {
                    acc[key] =
                        aggregated_results[key].length === 1
                            ? [aggregated_results[key][0]]
                            : aggregated_results[key];
                    return acc;
                }, {});
                return final_result;
            }
            else {
                return null;
            }
        });
    }
    // Function to insert a new user
    insertUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const user_data = extractUserData(user);
            // Convert array values in user_data to JSON string
            for (const key in user_data) {
                const item = user_data[key];
                if (Array.isArray(item)) {
                    user_data[key] = item.length === 0 ? null : item.join(',');
                }
            }
            const columns = User_1.db_references;
            const user_table_name = config_1.db_data.tables.users.name;
            const user_columns_string = Object.keys(columns).toString();
            const user_placeholders = Object.keys(columns)
                .map(() => '?')
                .join(', ');
            const sql = `INSERT INTO \`${user_table_name}\` (${user_columns_string}) VALUES (${user_placeholders})`;
            const args = Object.values(user_data);
            yield this.query(sql, args);
            yield this.disconnect();
        });
    }
    // Function to update an existing user
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
                const user_data = extractUserData(user);
                // Convert array values in user_data to JSON string
                for (const key in user_data) {
                    const item = user_data[key];
                    if (Array.isArray(item)) {
                        user_data[key] = item.length === 0 ? null : item.join(',');
                    }
                }
                const table_name = config_1.db_data.tables.users.name;
                const updates = Object.keys(user_data)
                    .map((column) => `${column} = ?`)
                    .join(', ');
                const sql = `UPDATE \`${table_name}\` SET ${updates} WHERE user_line_id = ?`;
                const args = [...Object.values(user_data), user.user_line_id];
                yield this.query(sql, args);
                console.log('User updated in the database');
            }
            catch (err) {
                console.error('Error updating user column: ', err); // Log error message
                throw err;
            }
            finally {
                yield this.disconnect();
            }
        });
    }
}
exports.DatabaseCommunicator = DatabaseCommunicator;
//------------Quick Test Driver -------------------------
/***
const arr = [
    {
        type: 'flex',
        altText: '物件情報の共有方法を選択してください',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: '他社提案物件を問い合わせる',
                        weight: 'bold',
                        size: 'lg',
                        align: 'center',
                    },
                    {
                        type: 'text',
                        contents: [
                            {
                                type: 'span',
                                text: '他社から提示された仲介手数料の\n',
                            },
                            {
                                type: 'span',
                                text: '『 半額 』',
                                weight: 'bold',
                            },
                            {
                                type: 'span',
                                text: 'でお受けいたします。',
                            },
                        ],
                        wrap: true,
                        margin: 'lg',
                    },
                    {
                        type: 'text',
                        text: '（スーモ、ホームズ、カナリーなど）',
                        size: 'xs',
                    },
                ],
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                    {
                        type: 'button',
                        style: 'primary',
                        action: {
                            type: 'message',
                            label: 'URLを送る',
                            text: 'URLを送る',
                        },
                        color: '#F09199',
                        margin: 'none',
                        height: 'sm',
                    },
                    {
                        type: 'button',
                        style: 'primary',
                        height: 'sm',
                        action: {
                            type: 'message',
                            label: 'PDFファイルを送る',
                            text: 'PDFファイルを送る',
                        },
                        color: '#F09199',
                        margin: 'xl',
                    },
                    {
                        type: 'button',
                        style: 'primary',
                        height: 'sm',
                        action: {
                            type: 'message',
                            label: '画像を送る',
                            text: '画像を送る',
                        },
                        color: '#F09199',
                        margin: 'xl',
                    },
                ],
                borderWidth: 'none',
            },
        },
    },
];
****/
// const dbc = new DatabaseCommunicator(db_data);
// // 非同期関数を定義して使用
// const run = async (): Promise<void> => {
//     await dbc.saveLastMessage('Ue478ad4286f7e7b0d2baf5e39bdb9908', arr);
//     console.log(await dbc.getLastMessage('Ue478ad4286f7e7b0d2baf5e39bdb9908'));
// };
// // 非同期関数を実行
// void run();
