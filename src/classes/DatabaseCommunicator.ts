import mysql, { Connection } from 'mysql';
import { UserTableColumns, DbData, db_data } from '../data/config';
import { User, db_references, UserData } from './User';
import { UserInfo, DataLocations, user_info_locations, Columns } from '../actions/get_info_action';

interface DBConnectionData {
    host: string;
    user: string;
    password: string;
    database: string;
}

//basically for database querying
function extractUserData(user: User): UserData {
    return {
        user_id: user.user_id,
        user_line_id: user.user_line_id,
        major_state_id: user.major_state_id,
        minor_state_id: user.minor_state_id,
        current_action_id: user.current_action_id,
        current_survey_id: user.current_survey_id,
        current_step_id: user.current_step_id,
        current_question_id: user.current_question_id,
        //null if the answer[] is empty
        current_answers: user.current_answers?.length ?? -1 > 0 ? user.current_answers : null,
    };
}

export class DatabaseCommunicator {
    private connection: Connection | null;
    private db_data: DbData = db_data;

    constructor(private db_connection_data: DBConnectionData) {
        this.connection = null;
    }

    // Method to establish connection with the database
    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.connection || this.connection.state === 'disconnected') {
                this.connection = mysql.createConnection({
                    host: this.db_connection_data.host,
                    user: this.db_connection_data.user,
                    password: this.db_connection_data.password,
                    database: this.db_connection_data.database,
                    connectTimeout: 30000,
                });

                // Add error handling for connection
                this.connection.connect((err) => {
                    if (err) {
                        console.error('Error connecting to the database: ', err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    // Method to disconnect from the database
    disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.connection && this.connection.state !== 'disconnected') {
                this.connection.end((err) => {
                    if (err) {
                        console.error('Error disconnecting from the database: ', err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    // Method to execute a query on the database
    // sql: SQL query string (e.g., "SELECT * FROM users")
    // args: Array of arguments to be passed to the SQL query (e.g., [userId])
    query(sql: string, args: unknown[]): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if (this.connection) {
                this.connection.query(sql, args, (err, rows) => {
                    if (err) {
                        console.error('Error executing query: ', err);
                        return reject(err);
                    }
                    resolve(rows);
                });
            } else {
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
    read<T = unknown>(table: string, columns: string[], condition: string): Promise<T> {
        const sql = `SELECT ${columns.join(', ')} FROM ?? WHERE ${condition}`;
        const args = [table];
        return this.query(sql, args) as Promise<T>;
    }

    // Method to write to the database
    // table: Name of the table to write to (e.g., "users")
    // data: Object where keys are column names and values are the corresponding data to insert (e.g., {name: "John", age: 30})
    write(table: string, data: Record<string, unknown>): Promise<unknown> {
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
    update(table: string, data: Record<string, unknown>, condition: string): Promise<unknown> {
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
    delete(table: string, condition: string): Promise<unknown> {
        const sql = `DELETE FROM ?? WHERE ${condition}`;
        const args = [table];
        return this.query(sql, args);
    }

    // ------- User Methods -------

    // Method to check if a user exists in the database
    // user: User object with a user_id property
    async userExists(user_line_id: string): Promise<boolean> {
        await this.connect();
        const sql = `SELECT EXISTS(SELECT 1 FROM users WHERE user_line_id = ?) AS user_exists`;
        const args = [user_line_id];
        const rows = (await this.query(sql, args)) as { user_exists: number }[];
        await this.disconnect();
        return rows[0].user_exists === 1;
    }

    // searches user by LINE ID and
    // returns an object with user class object properties
    async getUserByLineId(user_line_id: string): Promise<UserData | null> {
        await this.connect();
        const table_name = db_data.tables.users.name;
        const columns = db_references;
        const columns_string = Object.keys(columns).toString();
        const sql = `SELECT ${columns_string} FROM \`${table_name}\` WHERE user_line_id = ?`;
        const args = [user_line_id];
        const rows = (await this.query(sql, args)) as UserData[];
        await this.disconnect();
        if (rows.length > 0) {
            if (typeof rows[0].current_answers === 'string') {
                rows[0].current_answers = rows[0].current_answers.split(',');
            }
            return rows[0];
        } else {
            return null;
        }
    }

    // gets user info by LINE ID and
    // returns an object with user_info_columns properties
    async getInfoByUserId(user_id: string, data_locations: DataLocations): Promise<unknown> {
        await this.connect();
        const queries = Object.values(data_locations).map(async (location) => {
            const table_name = location.table_name;
            const columns = Object.keys(location.columns).join(', ');
            const sql = `SELECT ${columns} FROM \`${table_name}\` WHERE user_id = ?`;
            const args = [user_id];
            return this.query(sql, args) as Promise<UserInfo[]>;
        });
        const results = await Promise.all(queries);
        await this.disconnect();
        if (results.flat().length > 0) {
            // 結果を一つのオブジェクトにまとめる
            const aggregatedResults = results.flat().reduce((acc: Record<string, any>, row) => {
                Object.keys(row).forEach((key) => {
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(row[key]);
                });
                return acc;
            }, {});
            // 各キーの値が配列になっているオブジェクトを返す
            const finalResult = Object.keys(aggregatedResults).reduce(
                (acc: Record<string, any>, key: string) => {
                    acc[key] =
                        aggregatedResults[key].length === 1
                            ? aggregatedResults[key][0]
                            : aggregatedResults[key];
                    return acc;
                },
                {}
            );
            return finalResult;
        } else {
            return null;
        }
    }

    // Function to insert a new user
    async insertUser(user: User): Promise<void> {
        await this.connect();
        const user_data = extractUserData(user);
        // Convert array values in user_data to JSON string
        for (const key in user_data) {
            if (Array.isArray(user_data[key])) {
                user_data[key] = user_data[key].join(',');
            }
        }
        const columns = db_references;
        const user_table_name = db_data.tables.users.name;
        const user_columns_string = Object.keys(columns).toString();
        const user_placeholders = Object.keys(columns)
            .map(() => '?')
            .join(', ');
        const sql = `INSERT INTO \`${user_table_name}\` (${user_columns_string}) VALUES (${user_placeholders})`;
        const args = Object.values(user_data);
        await this.query(sql, args);
        await this.disconnect();
    }

    // Function to update an existing user
    async updateUser(user: User): Promise<void> {
        try {
            await this.connect();
            const user_data = extractUserData(user);
            // Convert array values in user_data to JSON string
            for (const key in user_data) {
                if (Array.isArray(user_data[key])) {
                    user_data[key] = user_data[key].join(',');
                }
            }
            const table_name = db_data.tables.users.name;
            const updates = Object.keys(user_data)
                .map((column) => `${column} = ?`)
                .join(', ');
            const sql = `UPDATE \`${table_name}\` SET ${updates} WHERE user_line_id = ?`;
            const args = [...Object.values(user_data), user.user_line_id];
            await this.query(sql, args);
            console.log('User updated in the database');
        } catch (err) {
            console.error('Error updating user column: ', err); // Log error message
            throw err;
        } finally {
            await this.disconnect();
        }
    }
}
