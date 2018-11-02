'use strict';
const mysql = require('mysql');
const logger = require('daily-logger');

class MySQL {

    constructor(DBConf) {
        this.pool = mysql.createPool(DBConf);
        this.getConnectObj().then(conn => this.connectObj = conn);
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

    /**
     * 获取连接，连接失败后重新连接
     */
    getConnectObj() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, conn) => {
                if (error) {
                    logger.error('[MYSQL DATABASE MESSAGE]:Database connection failed! reconnecting...');
                    logger.error(error);
                    console.error('[MYSQL DATABASE MESSAGE]:Database connection failed! reconnecting...');
                    reject(error);
                    // this.getConnectObj(); // 失败重连...
                } else {
                    console.log('----------------------------------------------数据库连接成功,创建连接池----------------------------------------------');
                    resolve(conn);
                }
            });
        });
    }

    /**
     * 数据库操作
     * @param {string} sql 
     * @param {array} options 
     */
    query(sql, options) {
        return new Promise((resolve, reject) => {
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
        });
    }
}

module.exports = MySQL;