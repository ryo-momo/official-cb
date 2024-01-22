const mysql = require('mysql');

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
            database: this.database
        });
    }

    // Method to disconnect from the database
    disconnect() {
        this.connection.end();
    }

    // Method to execute a query on the database
    // sql: SQL query string (e.g., "SELECT * FROM users")
    // args: Array of arguments to be passed to the SQL query (e.g., [userId])
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    // Method to read from the database
    // table: Name of the table to read from (e.g., "users")
    // columns: Array of column names to select (e.g., ["id", "name"])
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    read(table, columns, condition) {
        let sql = `SELECT ${columns.join(', ')} FROM ${table}`;
        if (condition) {
            sql += ` WHERE ${condition}`;
        }
        return this.query(sql);
    }

    // Method to write to the database
    // table: Name of the table to write to (e.g., "users")
    // data: Object where keys are column names and values are the corresponding data to insert (e.g., {name: "John", age: 30})
    write(table, data) {
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data).map(value => mysql.escape(value)).join(', ');
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
        return this.query(sql);
    }

    // Method to update the database
    // table: Name of the table to update (e.g., "users")
    // data: Object where keys are column names and values are the new values to set (e.g., {name: "John", age: 31})
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    update(table, data, condition) {
        const updates = Object.entries(data).map(([column, value]) => `${column} = ${mysql.escape(value)}`).join(', ');
        const sql = `UPDATE ${table} SET ${updates} WHERE ${condition}`;
        return this.query(sql);
    }

    // Method to delete from the database
    // table: Name of the table to delete from (e.g., "users")
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    delete(table, condition) {
        const sql = `DELETE FROM ${table} WHERE ${condition}`;
        return this.query(sql);
    }


// ------- User Methods -------


    // Method to check if a user exists in the database
    // user: User object with a user_id property
    userExists(user_line_id) {
        const sql = `SELECT EXISTS(SELECT 1 FROM users WHERE id = ${mysql.escape(user_line_id)})`;
        return this.query(sql).then(rows => rows[0][sql] === 1);
    }

    // searches user by LINE ID and
    // returns an object with user class object properties
    getUserByLineId(user_line_id){
        const sql = `SELECT user_id, user_line_id, major_state_id, minor_state_id, current_action_id, current_survey_id, current_step_id, current_question FROM users WHERE user_line_id = ${mysql.escape(user_line_id)}`;
        return this.query(sql).then(rows => {
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
        });
    }

    // Method to insert a new user into the database
    // user: User object with properties to insert
    // All properties except user_line_id can be null, if user_line_id is null, it throws an error
    insertUser(user) {
        if (user.user_line_id === null) {
            throw new Error("user_line_id cannot be null");
        }
        const table = db_data.tables.users.name;
        const data = {
            user_id: user.user_id || null,
            user_line_id: user.user_line_id,
            major_state_id: user.major_state_id || null,
            minor_state_id: user.minor_state_id || null,
            current_action_id: user.current_action_id || null,
            current_survey_id: user.current_survey_id || null,
            current_step_id: user.current_step_id || null,
            current_question: user.current_question || null
        };
        return this.write(table, data);
    }
    // Method to update a specific column of a user in the database
    // userId: ID of the user to update
    // columnName: Name of the column to update
    // newValue: New value to set
    updateUserColumn(userId, columnName, newValue) {
        const table = db_data.tables.users.name;
        const condition = `${db_data.tables.users.columns.user_id} = ${mysql.escape(userId)}`;
        const data = { [columnName]: newValue };
        return this.update(table, data, condition);
    }
}

module.exports = DatabaseCommunicator;