"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const Client = new index_1.MySQLClient({
    host: 'yourhost',
    user: 'yourusername',
    password: 'yourpassword',
    database: 'youdatabase',
    multipleStatements: true
});
Client.findOne({ sql: 'SELECT * FROM tb LIMIT 1' }).then(result => {
    console.log(result.data);
});
class MongoDB extends index_1.BaseDB {
    destroy(conn) {
    }
    execute(data) {
        return undefined;
    }
    getConnection() {
        return undefined;
    }
}
