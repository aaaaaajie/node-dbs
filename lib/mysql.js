"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MySQL = require("mysql");
const logger_1 = require("./logger");
class MySQLCli {
    /**
     * 构造函数
     * @param DBConf
     */
    constructor(DBConf) {
        if (!DBConf)
            throw Error('Please set up the database configuration!');
        this.DBConf = DBConf;
        this.test().then();
    }
    /** 测试连接 */
    async test() {
        const oConn = await this.getConn();
        if (oConn.hasError) {
            logger_1.default.write(oConn.message, 'error');
            // console.error(oConn.message, 'error')
            return;
        }
        logger_1.default.write('Database connection successful!');
        oConn.data.destroy(); // 删除此连接
    }
    /** 创建连接对象 */
    getConn() {
        const pool = MySQL.createPool(this.DBConf);
        const oResult = { hasError: false, message: '', data: null };
        return new Promise(resolve => {
            pool.getConnection((err, conn) => {
                if (err) {
                    oResult.hasError = true;
                    oResult.message = err;
                    return resolve(oResult);
                }
                conn.config.queryFormat = function (query, values) {
                    if (!values)
                        return query;
                    if (Array.isArray(values))
                        return MySQL.format(query, values);
                    return query.replace(/\:(\w+)/g, function (txt, key) {
                        if (values.hasOwnProperty(key))
                            return conn.escape(values[key]);
                        return txt;
                    }.bind(this));
                };
                oResult.data = conn;
                resolve(oResult);
            });
        });
    }
    /**
     * 增删改查 Base function
     * @param sql
     * @param params
     * @param conn
     * @return Promise<oResult>
     */
    query(sql, params, conn) {
        return new Promise(async (resolve) => {
            let Conn = null;
            if (conn)
                Conn = conn;
            else {
                const oConn = await this.getConn();
                if (oConn.hasError)
                    return resolve(oConn);
                Conn = oConn.data;
            }
            Conn.query(sql, params, (err, result) => {
                const oResult = { hasError: false, message: '', data: null };
                const SQL = Conn.config.queryFormat(sql, params);
                // console.log(SQL)
                if (err) {
                    oResult.hasError = true;
                    oResult.message = err;
                    logger_1.default.write(`[MESSAGE]:${err},\n[SQL]:${SQL}`, 'error');
                    return resolve(oResult);
                }
                oResult.data = result;
                return resolve(oResult);
            });
        });
    }
    /**
     * 开启事务
     * @return Promise<oResult>
     */
    beginTransaction() {
        return new Promise(async (resolve) => {
            const oConn = await this.getConn();
            if (oConn.hasError)
                return resolve(oConn);
            oConn.data.beginTransaction(err => {
                if (err) {
                    oConn.hasError = true;
                    oConn.message = err;
                    return resolve(oConn);
                }
                return resolve(oConn);
            });
        });
    }
    /**
     * 事务回滚
     * @param conn
     * @return Promise<oResult>
     */
    rollbackTransaction(conn) {
        return new Promise(resolve => {
            if (!conn)
                return resolve();
            conn.rollback(() => {
                conn.release();
                resolve();
            });
        });
    }
    /**
     * 事务提交
     * @param conn
     * @return Promise<oResult>
     */
    commitTransaction(conn) {
        return new Promise(resolve => {
            const oResult = { hasError: false, message: '', data: null };
            if (!conn) {
                oResult.hasError = true;
                oResult.message = '无连接';
                return resolve(oResult);
            }
            conn.commit(async (err) => {
                if (err) {
                    oResult.hasError = true;
                    oResult.message = err;
                    await this.rollbackTransaction(conn);
                    return resolve(oResult);
                }
                conn.release();
                resolve(oResult);
            });
        });
    }
    /**
     * 查询单项
     * @param sql
     * @param params
     * @param conn
     * @return Promise<oResult>
     */
    async findOne(sql, params, conn) {
        const oResult = { hasError: false, message: '', data: null };
        const R = await this.query(sql, params, conn);
        if (R.hasError)
            return R;
        if (!Array.isArray(R.data)) {
            oResult.hasError = true;
            oResult.message = 'Sorry, this function applies only to a single query！';
            return oResult;
        }
        if (!R.data.length) {
            oResult.data = null;
            return oResult;
        }
        oResult.data = R.data[0];
        return oResult;
    }
    /**
     * 查询列表
     * @param sql
     * @param params
     * @param conn
     * @return Promise<oResult>
     */
    async find(sql, params, conn) {
        const oResult = { hasError: false, message: '', data: null };
        const R = await this.query(sql, params, conn);
        if (R.hasError)
            return R;
        if (!Array.isArray(R.data)) {
            oResult.hasError = true;
            oResult.message = 'Sorry, this function only applies to the query list!';
            return oResult;
        }
        oResult.data = R.data;
        return oResult;
    }
    /**
     * 修改
     * @param sql
     * @param params
     * @param conn
     * @return Promise<oResult>
     */
    async update(sql, params, conn) {
        const oResult = { hasError: false, message: '', data: null };
        const R = await this.query(sql, params, conn);
        if (R.hasError)
            return R;
        oResult.data = R.data.changedRows;
        return oResult;
    }
    /**
     * 插入
     * @param sql
     * @param params
     * @param conn
     * @return Promise<oResult>
     */
    async insert(sql, params, conn) {
        const oResult = { hasError: false, message: '', data: null };
        const R = await this.query(sql, params, conn);
        if (R.hasError)
            return R;
        oResult.data = R.data.affectedRows;
        return oResult;
    }
    /**
     * 删除
     * @param sql
     * @param params
     * @param conn
     * @return Promise<oResult>
     */
    async delete(sql, params, conn) {
        const oResult = { hasError: false, message: '', data: null };
        const R = await this.query(sql, params, conn);
        if (R.hasError)
            return R;
        oResult.data = R.data.affectedRows;
        return oResult;
    }
    /**
     * 分页
     * @param sql
     * @param values
     * @param limit
     * @param conn
     * values:{
     *   otherKey:otherVal,
     *   Limit:[0,5]
     * }
     */
    page(sql, values, limit, conn) {
        values = Object.assign(values, {
            current: parseInt(limit[0]),
            size: parseInt(limit[1])
        });
        // console.log(values)
        sql = sql += ' LIMIT :current, :size';
        return this.find(sql, values, conn);
    }
    /***************************
     ** 获取条件请求对象
     ** 返回参数operator说明：
     ** = < > !=
     ** liftlike: like %str
     ** rigthlike: like %str
     ** doublelike: like %str%
     ***************************/
    getFindByConditionData() {
        return {
            sql: '',
            params: {},
            condition: [],
            order: [],
            limit: []
        };
    }
    /**
     * 拼接order
     * @param {*} str  sql
     * @param {*} item order对象
     * @param {*} bl 是否加order by关键字
     */
    order(str, item, bl) {
        item.sort = item.sort ? parseInt(item.sort) : 1;
        item.sort = item.sort === 1 ? 'ASC' : 'DESC';
        bl
            ? (str += ` ORDER BY COALESCE(${item.column}) ${item.sort}`)
            : (str += `, ${item.column} ${item.sort}`);
        return str;
    }
    /**
     * 拼接sql
     * @param {*} data
     */
    concatCondition(data) {
        // 拼接where
        if (!data.sql)
            throw new Error('[DB MESSAGE]:Data.sql cannot be empty!');
        if (!Array.isArray(data.condition))
            throw new Error('[DB MESSAGE]:Data.condition must is Array!');
        let str = data.sql;
        // 拼接 WHERE
        if (data.condition.length) {
            str += ' WHERE ';
            data.condition.forEach((obj, index) => {
                obj.operator = obj.operator ? obj.operator.toLowerCase() : '=';
                obj.connector = obj.connector ? obj.connector : 'AND';
                switch (obj.operator) {
                    case 'leftlike':
                        data.params[obj.column] = `%${data.params[obj.column]}`;
                        obj.operator = 'LIKE';
                        break;
                    case 'rightlike':
                        data.params[obj.column] = `${data.params[obj.column]}%`;
                        obj.operator = 'LIKE';
                        break;
                    case 'doublelike':
                        data.params[obj.column] = `%${data.params[obj.column]}%`;
                        obj.operator = 'LIKE';
                        break;
                }
                if (index === 0) {
                    str += ` (${obj.column} ${obj.operator} :${obj.column}) `;
                }
                else {
                    str += ` ${obj.connector} (${obj.column} ${obj.operator} :${obj.column})`;
                }
            });
        }
        return str;
    }
    /**
     * 按条件查询
     * @param {*} data
     */
    findByCondition(data, conn) {
        let str = this.concatCondition({
            sql: data.sql,
            condition: data.condition,
            params: data.params
        });
        // console.log(str);
        if (data.order && Array.isArray(data.order) && data.order.length) {
            data.order.forEach((item, index) => {
                let bl = false;
                if (index === 0)
                    bl = true;
                str = this.order(str, item, bl);
            });
        }
        if (Array.isArray(data.limit) && data.limit.length)
            return this.page(str, data.params, data.limit, conn);
        return this.find(str, data.params, conn);
    }
    /**
     * 按条件修改
     * @param {*} data
     */
    updateByCondition(data, conn) {
        const oData = { sql: data.sql, condition: data.condition, params: {} };
        let str = this.concatCondition(oData);
        return this.update(str, data.params, conn);
    }
}
exports.default = MySQLCli;
