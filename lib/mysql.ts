import * as MySQL from 'mysql'
import Logger from './logger'
import { DataType } from './IO_Data_interface'
import { InputDataType } from './Input_Data_interface'
import BaseDBInterface from './db_mysql_interface'
import BaseDB from './db_base'

class MySQLClient extends BaseDB implements BaseDBInterface {

  constructor (DBConf: object) {
    if (!DBConf) throw Error('Please set up the database configuration!')
    super('mysql', DBConf)
  }

  /**
   * 创建连接对象
   */
  getConnection (): Promise<DataType> {
    const pool = MySQL.createPool(this.config)
    const oResult: DataType = { hasError: false, message: '', data: null }
    return new Promise<DataType>(resolve => {
      pool.getConnection((err: string, conn: any) => {
        if (err) {
          oResult.hasError = true
          oResult.message = err
          return resolve(oResult)
        }
        conn.config.executeFormat = function (query, values) {
          if (!values) return query
          if (Array.isArray(values)) return MySQL.format(query, values)
          return query.replace(
            /\:(\w+)/g,
            function (txt, key) {
              if (values.hasOwnProperty(key)) return conn.escape(values[key])
              return txt
            }.bind(this)
          )
        }
        oResult.data = conn
        resolve(oResult)
      })
    })
  }

  destroy (conn: DataType): void {
    conn.data.destroy()
  }

  /**
   * 增删改查 Base function
   * @return Promise<oResult>
   * @param data
   */
  execute (data: InputDataType): Promise<DataType> {
    return new Promise<DataType>(async resolve => {
      let Conn = null
      if (data.conn) Conn = data.conn
      else {
        const oConn: DataType = await this.getConnection()
        if (oConn.hasError) return resolve(oConn)
        Conn = oConn.data
      }

      Conn.query(data.sql, data.params, (err, result) => {
        const oResult: DataType = { hasError: false, message: '', data: null }
        const SQL = Conn.config.executeFormat(data.sql, data.params)
        // console.log(SQL)
        if (err) {
          oResult.hasError = true
          oResult.message = err
          Logger.write(`[MESSAGE]:${err},\n[SQL]:${SQL}`, 'error')
          return resolve(oResult)
        }
        oResult.data = result
        return resolve(oResult)
      })
    })
  }

  /**
   * 开启事务
   * @return Promise<oResult>
   */
  beginTransaction (): Promise<DataType> {
    return new Promise(async resolve => {
      const oConn: DataType = await this.getConnection()
      if (oConn.hasError) return resolve(oConn)
      oConn.data.beginTransaction(err => {
        if (err) {
          oConn.hasError = true
          oConn.message = err
          return resolve(oConn)
        }
        return resolve(oConn)
      })
    })
  }

  /**
   * 事务回滚
   * @param conn
   * @return Promise<oResult>
   */
  rollbackTransaction (conn): Promise<DataType> {
    return new Promise(resolve => {
      if (!conn) return resolve()
      conn.rollback(() => {
        conn.release()
        resolve()
      })
    })
  }

  /**
   * 事务提交
   * @param conn
   * @return Promise<oResult>
   */
  commitTransaction (conn) {
    return new Promise<DataType>(resolve => {
      const oResult: DataType = { hasError: false, message: '', data: null }
      if (!conn) {
        oResult.hasError = true
        oResult.message = '无连接'
        return resolve(oResult)
      }
      conn.commit(async err => {
        if (err) {
          oResult.hasError = true
          oResult.message = err
          await this.rollbackTransaction(conn)
          return resolve(oResult)
        }
        conn.release()
        resolve(oResult)
      })
    })
  }

  /**
   * 查询单项
   * @return Promise<oResult>
   * @param data
   */
  async findOne (data: InputDataType): Promise<DataType> {
    const oResult: DataType = { hasError: false, message: '', data: null }
    const R: DataType = await this.execute({ sql: data.sql, params: data.params, conn: data.conn })
    if (R.hasError) return R
    if (!Array.isArray(R.data)) {
      oResult.hasError = true
      oResult.message = 'Sorry, this function applies only to a single execute！'
      return oResult
    }
    if (!R.data.length) {
      oResult.data = null
      return oResult
    }
    oResult.data = R.data[0]
    return oResult
  }

  /**
   * 查询列表
   * @return Promise<oResult>
   * @param data
   */
  async find (data: InputDataType): Promise<DataType> {
    const oResult: DataType = { hasError: false, message: '', data: null }
    const R = await this.execute({ sql: data.sql, params: data.params, conn: data.conn })
    if (R.hasError) return R
    if (!Array.isArray(R.data)) {
      oResult.hasError = true
      oResult.message = 'Sorry, this function only applies to the execute list!'
      return oResult
    }
    oResult.data = R.data
    return oResult
  }

  /**
   * 修改
   * @return Promise<oResult>
   * @param data
   */
  async update (data: InputDataType): Promise<DataType> {
    const oResult: DataType = { hasError: false, message: '', data: null }
    const R = await this.execute({ sql: data.sql, params: data.params, conn: data.conn })
    if (R.hasError) return R
    oResult.data = R.data.changedRows
    return oResult
  }

  /**
   * 插入
   * @return Promise<oResult>
   * @param data
   */
  async insert (data: InputDataType): Promise<DataType> {
    const oResult: DataType = { hasError: false, message: '', data: null }
    const R = await this.execute({ sql: data.sql, params: data.params, conn: data.conn })
    if (R.hasError) return R
    oResult.data = R.data.affectedRows
    return oResult
  }

  /**
   * 删除
   * @return Promise<oResult>
   * @param data
   */
  async delete (data: InputDataType): Promise<DataType> {
    const oResult: DataType = { hasError: false, message: '', data: null }
    const R = await this.execute({ sql: data.sql, params: data.params, conn: data.conn })
    if (R.hasError) return R
    oResult.data = R.data.affectedRows
    return oResult
  }

  /**
   * 分页
   * values:{
   *   otherKey:otherVal,
   *   Limit:[0,5]
   * }
   * @param data
   */
  async page (data: InputDataType): Promise<DataType> {
    data.params = Object.assign(data.params, {
      current: parseInt(data.limit[0]),
      size: parseInt(data.limit[1])
    })
    // console.log(values)
    data.sql = data.sql += ' LIMIT :current, :size'
    return this.find({ sql: data.sql, params: data.params, limit: data.limit, conn: data.conn })
  }

  /***************************
   ** 获取条件请求对象
   ** 返回参数operator说明：
   ** = < > !=
   ** liftlike: like %str
   ** rigthlike: like %str
   ** doublelike: like %str%
   ***************************/
  getFindByConditionData () {
    return {
      sql: '',
      params: {},
      condition: [],
      order: [],
      limit: []
    }
  }

  /**
   * 拼接order
   * @param {*} str  sql
   * @param {*} item order对象
   * @param {*} bl 是否加order by关键字
   */
  order (str: string, item: { sort?, column?: string }, bl: boolean): string {
    item.sort = item.sort ? parseInt(item.sort) : 1
    item.sort = item.sort === 1 ? 'ASC' : 'DESC'
    bl
      ? (str += ` ORDER BY COALESCE(${item.column}) ${item.sort}`)
      : (str += `, ${item.column} ${item.sort}`)
    return str
  }

  /**
   * 拼接sql
   * @param {*} data
   */
  concatCondition (data: InputDataType): string {
    // 拼接where
    if (!data.sql) throw new Error('[DB MESSAGE]:Data.sql cannot be empty!')
    if (!Array.isArray(data.condition))
      throw new Error('[DB MESSAGE]:Data.condition must is Array!')
    let str = data.sql
    // 拼接 WHERE
    if (data.condition.length) {
      str += ' WHERE '
      data.condition.forEach((obj, index) => {
        obj.operator = obj.operator ? obj.operator.toLowerCase() : '='
        obj.connector = obj.connector ? obj.connector : 'AND'
        switch (obj.operator) {
          case 'leftlike':
            data.params[obj.column] = `%${data.params[obj.column]}`
            obj.operator = 'LIKE'
            break
          case 'rightlike':
            data.params[obj.column] = `${data.params[obj.column]}%`
            obj.operator = 'LIKE'
            break
          case 'doublelike':
            data.params[obj.column] = `%${data.params[obj.column]}%`
            obj.operator = 'LIKE'
            break
        }
        if (index === 0) {
          str += ` (${obj.column} ${obj.operator} :${obj.column}) `
        } else {
          str += ` ${obj.connector} (${obj.column} ${obj.operator} :${obj.column})`
        }
      })
    }
    return str
  }

  /**
   * 按条件查询
   * @param {*} data
   */
  findByCondition (data: InputDataType): Promise<DataType> {
    let str = this.concatCondition({
      sql: data.sql,
      condition: data.condition,
      params: data.params
    })
    // console.log(str);
    if (data.order && Array.isArray(data.order) && data.order.length) {
      data.order.forEach((item, index) => {
        let bl = false
        if (index === 0) bl = true
        str = this.order(str, item, bl)
      })
    }
    if (Array.isArray(data.limit) && data.limit.length)
      return this.page({ sql: str, params: data.params, limit: data.limit, conn: data.conn })
    return this.find({ sql: str, params: data.params, conn: data.conn })
  }

  /**
   * 按条件修改
   * @param {*} data
   */
  updateByCondition (data: InputDataType): Promise<DataType> {
    const oData: InputDataType = { sql: data.sql, condition: data.condition, params: {} }
    let str = this.concatCondition(oData)
    return this.update({ sql: str, params: data.params, conn: data.conn })
  }
}

export default MySQLClient
