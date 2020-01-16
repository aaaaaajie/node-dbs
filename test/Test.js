"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const Client = new index_1.MySQLClient({
    host: 'rm-wz989c60z42kpw9s9ro.mysql.rds.aliyuncs.com',
    user: 'root',
    password: 'P@ssWord',
    database: 'blog',
    multipleStatements: true
});
Client.findOne({ sql: 'SELECT * FROM user LIMIT 1' }).then(result => {
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
