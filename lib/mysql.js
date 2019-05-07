'use strict'
const mysql = require('mysql')
const logger = require('tracer').console()
const writeLog = require('daily-logger')

class MySQL {

  /**
   * 构造函数
   * @param args
   */
  constructor (...args) {
    this._config = null
    switch (args.length) {
      case 0:
        // this._config = this.config
        break
      case 1:
        if (args[0].constructor === Object) this.config = args[0]
        break
      default:
        break
    }
    // this.setPool()
  }

  /**
   * 创建连接池
   * @returns {Pool}
   */
  setPool () {
    if (!this.config) logger.error('[DATABASE MESSAGE]:Please set up the database configuration!')
    return mysql.createPool(this.config)
  }

  /**
   * getter setter 函数
   * @param conf
   */
  set config (conf) {this._config = conf}

  get config () { return this._config}

  /**
   * 数据库操作
   * @param {string} sql
   * @param {array} options
   */
  query (sql, options) {
    const oResult = {hasError: false, message: '', data: null}
    return new Promise(resolve => {
      this.setPool().getConnection((err, conn) => {
        if (err) {
          logger.error('[MYSQL DATABASE MESSAGE]:Database connection failed! reconnecting...')
          oResult.hasError = true
          oResult.message = err.message
          return resolve(oResult)
        }
        const SQL = conn.query(sql, options, (error, results) => {
          // 释放连接
          conn.release()
          if (error) {
            writeLog.error(error)
            logger.error('[ERROR MESSAGE]:' + error)
            logger.error('[SQL MESSAGE]:' + SQL.sql)
            oResult.hasError = true
            oResult.message = error.message
            return resolve(oResult)
          }
          writeLog.trace('[SQL MESSAGE]:' + SQL.sql)
          writeLog.log(SQL.sql)
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

  static getInstance (...args) {
    switch (args.length) {
      case 0:
        MySQL.instance = new MySQL()
        break
      case 1:
        MySQL.instance = new MySQL(args[0])
        break
      default:
        break
    }
  }
}
module.exports = MySQL
