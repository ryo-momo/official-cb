const mysql = require('mysql');
const db_data = require('./data/config')

class DatabaseCommunicator {
    constructor(db_connection_data){
        this.host = db_connection_data.host;
        this.user = db_connection_data.user;
        this.password = db_connection_data.password;
        this.database = db_connection_data.database
    }

    // Method to establish connection with the database
    connect() {
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            connectTimeout: 30000
        });

        // Add error handling for connection
        this.connection.connect(err => {
            if (err) {
                console.error('Error connecting to the database: ', err);
                throw err;
            }
        });
    }

    // Method to disconnect from the database
    disconnect() {
        if (this.connection && this.connection.state !== 'disconnected') {
            this.connection.end(err => {
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
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    console.error('Error executing query: ', err);
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    // Method to read from the database
    // table: Name of the table to read from (e.g., "users")
    // columns: Array of column names to select (e.g., ["id", "name"])
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    read(table, columns, condition) {
        let sql = `SELECT ${columns.join(', ')} FROM ?? WHERE ${condition}`;
        let args = [table];
        return this.query(sql, args);
    }

    // Method to write to the database
    // table: Name of the table to write to (e.g., "users")
    // data: Object where keys are column names and values are the corresponding data to insert (e.g., {name: "John", age: 30})
    write(table, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const sql = `INSERT INTO ?? (${columns.join(', ')}) VALUES (?)`;
        let args = [table, values];
        return this.query(sql, args);
    }

    // Method to update the database
    // table: Name of the table to update (e.g., "users")
    // data: Object where keys are column names and values are the new values to set (e.g., {name: "John", age: 31})
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    update(table, data, condition) {
        const updates = Object.entries(data).map(([column, value]) => `${column} = ?`).join(', ');
        const sql = `UPDATE ?? SET ${updates} WHERE ${condition}`;
        let args = [table, ...Object.values(data)];
        return this.query(sql, args);
    }

    // Method to delete from the database
    // table: Name of the table to delete from (e.g., "users")
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    delete(table, condition) {
        const sql = `DELETE FROM ?? WHERE ${condition}`;
        let args = [table];
        return this.query(sql, args);
    }

    // ------- User Methods -------


    // Method to check if a user exists in the database
    // user: User object with a user_id property
    async userExists(user_line_id) {
        const sql = `SELECT EXISTS(SELECT 1 FROM users WHERE user_line_id = ?)`;
        let args = [user_line_id];
        const rows = await this.query(sql, args);
        return rows[0][sql] === 1;
    }

// Other code...

    // searches user by LINE ID and
    // returns an object with user class object properties
    getUserByLineId(user_line_id){
        const sql = `SELECT user_id, user_line_id, major_state_id, minor_state_id, current_action_id, current_survey_id, current_step_id, current_question FROM users WHERE user_line_id = ?`;
        let args = [user_line_id];
        return this.query(sql, args).then(rows => {
            if (rows.length > 0) {
                console.log("runj")
                return rows[0];
            } else {
                console.log("runjjjjjjj")
                return null;
            }
        });
    }

    // Method to save a user to the database
    // user: User object with properties to insert or update
    // All properties except user_line_id can be null, if user_line_id is null, it throws an error
    async saveUser(user) {
        const tableName = db_data.tables.users.name;
        const sql = `INSERT INTO \`${tableName}\` (user_id, user_line_id, major_state_id, minor_state_id, current_action_id, current_survey_id, current_step_id, current_question) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        let args = [user.user_id, user.user_line_id, user.major_state_id, user.minor_state_id, user.current_action_id, user.current_survey_id, user.current_step_id, user.current_question];
        await this.query(sql, args);
    }
}

module.exports = DatabaseCommunicator;