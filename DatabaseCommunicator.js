const mysql  = require('mysql');

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
}