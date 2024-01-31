import mysql, { Connection } from 'mysql';
import { UserTableColumns, DbData, db_data } from '../data/config';
import { User, db_references } from './User';
import { UserData } from './User';

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
    private host: string;
    private user: string;
    private password: string;
    private database: string;
    private connection: Connection | null;
    private db_data: DbData = db_data;

    constructor(db_connection_data: DBConnectionData) {
        this.host = db_connection_data.host;
        this.user = db_connection_data.user;
        this.password = db_connection_data.password;
        this.database = db_connection_data.database;
        this.connection = null;
    }

    // Method to establish connection with the database
    connect(): void {
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            connectTimeout: 30000,
        });

        // Add error handling for connection
        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to the database: ', err);
                throw err;
            }
        });
    }

    // Method to disconnect from the database
    disconnect(): void {
        if (this.connection && this.connection.state !== 'disconnected') {
            this.connection.end((err) => {
                if (err) {
                    console.error('Error disconnecting from the database: ', err);
                    throw err;
                }
            });
        }
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
                reject(new Error('Database connection is null.'));
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
        const sql = `SELECT EXISTS(SELECT 1 FROM users WHERE user_line_id = ?) AS user_exists`;
        const args = [user_line_id];
        const rows = (await this.query(sql, args)) as { user_exists: number }[];
        return rows[0].user_exists === 1;
    }

    // Other code...

    // searches user by LINE ID and
    // returns an object with user class object properties
    getUserByLineId(user_line_id: string): Promise<UserData | null> {
        const table_name = db_data.tables.users.name;
        const columns = db_references;
        const columns_string = Object.keys(columns).toString();
        const sql = `SELECT ${columns_string} FROM \`${table_name}\` WHERE user_line_id = ?`;
        const args = [user_line_id];
        return this.query(sql, args).then((rows) => {
            const typedRows = rows as UserData[];
            if (typedRows.length > 0) {
                return typedRows[0];
            } else {
                return null;
            }
        });
    }

    // Function to insert a new user
    async insertUser(user: User): Promise<void> {
        const user_data = extractUserData(user);
        const table_name = db_data.tables.users.name;
        const columns = db_references;
        const columns_string = Object.keys(columns).toString();
        const placeholders = Object.keys(columns)
            .map(() => '?')
            .join(', ');
        const sql = `INSERT INTO \`${table_name}\` (${columns_string}) VALUES (${placeholders})`;
        const args = Object.values(user_data);
        await this.query(sql, args);
        console.log('User inserted into the database:', Object.values(user_data).toString());
    }

    // Function to update an existing user
    async updateUser(user: User): Promise<void> {
        const user_data = extractUserData(user);
        const table_name = db_data.tables.users.name;
        const updates = Object.keys(user_data)
            .map((column) => `${column} = ?`)
            .join(', ');
        const sql = `UPDATE \`${table_name}\` SET ${updates} WHERE user_line_id = ?`;
        const args = [...Object.values(user_data), user.user_line_id];
        await this.query(sql, args);
        console.log('User updated in the database:', Object.values(user_data).toString());
    }
}
