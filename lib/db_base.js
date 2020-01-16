"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
/**
 * 数据库抽象类
 */
class BaseDB {
    constructor(DBType, DBConf) {
        this._type = DBType;
        this._config = DBConf;
        this.test();
    }
    get config() {
        return this._config;
    }
    set config(DBConf) {
        this._config = DBConf;
    }
    /**
     * 测试连接
     */
    test() {
        this.getConnection().then((conn) => {
            console.log(`${this._type} connection successful!`);
            logger_1.default.write(`${this._type} connection successful!`);
            this.destroy(conn);
        });
    }
}
exports.default = BaseDB;
