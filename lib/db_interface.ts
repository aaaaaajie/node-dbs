import { DataType } from './IO_Data_interface'

interface BaseDBInterface {

  /**
   * 增删改查 Base function
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  query: (sql: string, params: object, conn?) => Promise<DataType>;

  /**
   * 开启事务
   * @return Promise<DataType>
   */
  beginTransaction: () => Promise<DataType>;

  /**
   * 事务回滚
   * @param conn
   * @return Promise<DataType>
   */
  rollbackTransaction: (conn) => Promise<DataType>;

  /**
   * 事务提交
   * @param conn
   * @return Promise<DataType>
   */
  commitTransaction: (conn) => Promise<DataType>;

  /**
   * 查询单项
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  findOne: (sql: string, params?: object, conn?) => Promise<DataType>;

  /**
   * 查询列表
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  find: (sql: string, params: object, conn?) => Promise<DataType>;

  /**
   * 修改
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  update: (sql: string, params: object, conn?) => Promise<DataType>;

  /**
   * 插入
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  insert: (sql: string, params: object, conn?) => Promise<DataType>;

  /**
   * 删除
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  delete: (sql: string, params: object, conn?) => Promise<DataType>;

  /**
   * 分页
   * @param sql
   * @param values
   * values:{
   *   otherKey:otherVal,
   *   Limit:[0,5]
   * }
   * @return Promise<DataType>
   */
  page: (sql: string, values: object, limit: number, conn?) => Promise<DataType>;

  /***************************
   ** 获取条件请求对象
   ** 返回参数operator说明：
   ** = < > !=
   ** liftlike: like %str
   ** rigthlike: like %str
   ** doublelike: like %str%
   ** @return object
   ***************************/
  getFindByConditionData: () => object

  /**
   * 拼接order
   * @param str
   * @param item order对象
   * @param bl 是否加order by关键字
   * @return string
   */
  order: (str: string, item: { sort?, column?: string }, bl: boolean) => string

  /**
   * 拼接sql
   * @param data
   * @return string
   */
  concatCondition: (data: { sql: string, condition: Array<any>, params: object }) => string

  /**
   * 按条件查询
   * @param data
   * @return Promise<DataType>
   */
  findByCondition: (data: { sql: string, condition: Array<any>, params?: object, order?: Array<any>, limit?: number }, conn?) => Promise<DataType>

  /**
   * 按条件修改
   * @param data
   * @return Promise<DataType>
   */
  updateByCondition: (data: { sql: string, condition: Array<any>, params: object }, conn?) => Promise<DataType>
}

export default BaseDBInterface