'use strict'
const mysql = require('mysql')
const logger = require('daily-logger')
const print = require('tracer').console()

class MySQL {

  constructor (DBConf) {
    this.pool = null
    this.getPool(DBConf)
  }

  getPool (DBConf) {
    if (!this.pool && DBConf) {
      this.pool = mysql.createPool(DBConf)
    }
    return this.pool
  }

  /**
   * 数据库操作
   * @param {string} sql
   * @param {array} options
   */
  query (sql, options) {
    const oResult = {hasError: false, message: '', data: null}
    return new Promise(resolve => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          logger.error('[MYSQL DATABASE MESSAGE]:Database connection failed! reconnecting...')
          print.error('[MYSQL DATABASE MESSAGE]:Database connection failed! reconnecting...')
          oResult.hasError = true
          oResult.message = err.message
          return resolve(oResult)
        }
        const SQL = conn.query(sql, options, (error, results) => {
          // 释放连接
          conn.release()
          if (error) {
            logger.error('[ERROR MESSAGE]:' + error)
            logger.error('[SQL MESSAGE]:' + SQL.sql)
            oResult.hasError = true
            oResult.message = error.message
            return resolve(oResult)
          }
          logger.trace('[SQL MESSAGE]:' + SQL.sql)
          // 事件驱动回调
          oResult.data = results
          resolve(oResult)
        })
      })
    })
  }

  /**
   * 查询列表
   * @param sql
   * @param options
   * @returns {Promise<any>}
   */
  async find (sql, options) {
    const oResult = await this.query(sql, options)
    if (oResult.hasError) return oResult
    if (!Array.isArray(oResult.data)) oResult.hasError = true
    return oResult
  }

  /**
   * 查询单条记录
   * @param sql
   * @param options
   * @returns {Promise<any>}
   */
  async findOne (sql, options) {
    const oResult = await this.query(sql, options)
    if (oResult.hasError) return oResult
    if (!oResult.data) oResult.hasError = true
    if (oResult.data.length < 0) oResult.data = null
    oResult.data = oResult.data[0]
    return oResult
  }

  async insertOrUpdate (sql, options) {
    // const oResult = await this.query(sql)
  }

  /**
   * 数据库配置
   * @param {object} conf
   */
  static setConf (conf) {
    if (!conf) {
      print.error('[DATABASE MESSAGE]:Please set up the database configuration!')
      return
    } else {
      if (!MySQL.DBConf) {
        MySQL.DBConf = conf
      }
      return MySQL.DBConf
    }
  }

  /**
   * 数据库单例
   */
  static getInstance () {
    if (!MySQL.DBConf) {
      MySQL.setConf()
    }
    if (!MySQL.instance) {
      MySQL.instance = new MySQL(MySQL.DBConf)
    }
    return MySQL.instance
  }
}

module.exports = MySQL
