"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlClient = exports.BaseDB = void 0;
const base_1 = require("./src/entity/base");
exports.BaseDB = base_1.default;
const mysql_1 = require("./src/mysql");
exports.MysqlClient = mysql_1.default;
