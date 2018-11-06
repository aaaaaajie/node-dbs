'use strict';
const mysql = require('mysql');
const logger = require('daily-logger');
const print = require('tracer').console();

class MySQL {

    constructor(DBConf) {
        this.pool = null;
        this.getPool(DBConf);
    }

    getPool(DBConf) {
        if (!this.pool) {
            this.pool = mysql.createPool(DBConf);
        }
        return this.pool;
    }

    /**
     * 数据库操作
     * @param {string} sql 
     * @param {array} options 
     */
    query(sql, options) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err) => {
                if (err) {
                    logger.error('[MYSQL DATABASE MESSAGE]:Database connection failed! reconnecting...');
                    logger.error(err);
                    print.error('[MYSQL DATABASE MESSAGE]:Database connection failed! reconnecting...');
                    reject(err);
                    // this.getConnectObj(); // 失败重连...
                } else {
                    print.log('----------------------------------------------数据库连接成功,创建连接池----------------------------------------------');
                    let logsql = this.connectObj.query(sql, options, (error, results) => {
                        //释放连接  
                        this.connectObj.release();
                        if (error) {
                            logger.error("[ERROR MESSAGE]:" + error);
                            logger.error("[SQL MESSAGE]:" + logsql.sql);
                            reject(error);
                        } else {
                            logger.trace("[SQL MESSAGE]:" + logsql.sql);
                            //事件驱动回调  
                            resolve(results);
                        }
                    });
                }
            });
        });
    }

    /**
     * 数据库单例
     * @param {object} DBConf 
     */
    static getInstance(DBConf) {
        if (!MySQL.instance) {
            MySQL.instance = new MySQL(DBConf);
        }
        return MySQL.instance;
    }
}

module.exports = MySQL;