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
    this._map = new Map()
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
   * 获取map值
   * @param K
   * @returns {V}
   */
  getVal (K) {return this._map.get(K)}

  /**
   * 设置map值
   * @param K
   * @param V
   */
  setVal (K, V) {
    this._map.set(K, V)
  }

  /**
   * 数据库操作
   * @param sql
   * @param options
   * @returns {Promise<*>}
   */
  async query (sql, options) {
    return new Promise(async resolve => {
      const oResult = await this.getConn()
      if (oResult.hasError) resolve(oResult)
      const Conn = oResult.data
      const SQL = mysql.format(sql, options)
      Conn.query(sql, options, (error, results) => {
        // 释放连接
        Conn.release()
        if (error) {
          writeLog.error(error)
          logger.error('[ERROR MESSAGE]:' + error)
          logger.error('[SQL MESSAGE]:' + SQL)
          oResult.hasError = true
          oResult.message = error.message
          return resolve(oResult)
        }
        writeLog.trace('[SQL MESSAGE]:' + SQL)
        writeLog.log(SQL)
        // 事件驱动回调
        oResult.data = results
        resolve(oResult)
      })
    })

  }

  /**
   * 获取连接
   * @param {string} sql
   * @param {array} options
   */
  getConn () {
    const oResult = {hasError: false, message: '', data: null}
    return new Promise(resolve => {
      this.setPool().getConnection((err, conn) => {
        if (err) {
          logger.error('[MYSQL DATABASE MESSAGE]:Database connection failed! reconnecting...')
          oResult.hasError = true
          oResult.message = err.message
          resolve(oResult)
        }
        /*conn.config.queryFormat = function (query, values) {
          if (!values) return query
          return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
              return this.escape(values[key])
            }
            return txt
          }.bind(this))
        }*/
        oResult.data = conn
        resolve(oResult)
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

  async insert (sql, options) {
    const oResult = await this.query(sql, options)
    if (oResult.hasError) return oResult
    console.log(oResult)
    if (oResult.data.hasOwnProperty('insertId')) this.setVal('insertId', oResult.data.insertId)
    oResult.data = oResult.data.affectedRows
    return oResult
  }

  async update (sql, options) {
    const oResult = await this.query(sql, options)
    if (oResult.hasError) return oResult
    oResult.data = oResult.data.changedRows
    return oResult
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
