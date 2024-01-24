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
        this.connection.end();
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
        let sql = `SELECT ?? FROM ?? WHERE ??`;
        let args = [columns, table, condition];
        return this.query(sql, args);
    }

    // Method to write to the database
    // table: Name of the table to write to (e.g., "users")
    // data: Object where keys are column names and values are the corresponding data to insert (e.g., {name: "John", age: 30})
    write(table, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const sql = `INSERT INTO ?? (??) VALUES (?)`;
        let args = [table, columns, values];
        return this.query(sql, args);
    }

    // Method to update the database
    // table: Name of the table to update (e.g., "users")
    // data: Object where keys are column names and values are the new values to set (e.g., {name: "John", age: 31})
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    update(table, data, condition) {
        const updates = Object.entries(data).map(([column, value]) => `${column} = ?`).join(', ');
        const sql = `UPDATE ?? SET ${updates} WHERE ??`;
        let args = [table, ...Object.values(data), condition];
        return this.query(sql, args);
    }

    // Method to delete from the database
    // table: Name of the table to delete from (e.g., "users")
    // condition: SQL condition string for WHERE clause (e.g., "id = 1")
    delete(table, condition) {
        const sql = `DELETE FROM ?? WHERE ??`;
        let args = [table, condition];
        return this.query(sql, args);
    }


// ------- User Methods -------


    // Method to check if a user exists in the database
    // user: User object with a user_id property
    userExists(user_line_id) {
        const sql = `SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)`;
        let args = [mysql.escape(user_line_id)];
        return this.query(sql, args).then(rows => rows[0][sql] === 1);
    }

    // searches user by LINE ID and
    // returns an object with user class object properties
    getUserByLineId(user_line_id){
        const sql = `SELECT user_id, user_line_id, major_state_id, minor_state_id, current_action_id, current_survey_id, current_step_id, current_question FROM users WHERE user_line_id = ?`;
        let args = [mysql.escape(user_line_id)];
        return this.query(sql, args).then(rows => {
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
        });
    }

    // Method to save a user to the database
    // user: User object with properties to insert or update
    // All properties except user_line_id can be null, if user_line_id is null, it throws an error
    saveUser(user) {
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

        if (this.userExists(user.user_line_id)) {
            const condition = `${db_data.tables.users.columns.user_id} = ?`;
            return this.update(table, data, condition);
        } else {
            return this.write(table, data);
        }
    }
}

module.exports = DatabaseCommunicator;