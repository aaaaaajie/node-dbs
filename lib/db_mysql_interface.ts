import { DataType } from './IO_Data_interface'
import { InputDataType } from './Input_Data_interface'

interface MysqlInterface {

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
  findOne: (data: InputDataType) => Promise<DataType>;

  /**
   * 查询列表
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  find: (data: { conn: any; limit: number; params: object; sql: string }) => Promise<DataType>;

  /**
   * 修改
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  update: (data: InputDataType) => Promise<DataType>;

  /**
   * 插入
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  insert: (data: InputDataType) => Promise<DataType>;

  /**
   * 删除
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  delete: (data: InputDataType) => Promise<DataType>;

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
  page: (data: InputDataType) => Promise<DataType>;

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
  concatCondition: (data: { condition: Array<any>; params: object; sql: string }) => string

  /**
   * 按条件查询
   * @param data
   * @return Promise<DataType>
   */
  findByCondition: (data: InputDataType) => Promise<DataType>

  /**
   * 按条件修改
   * @param data
   * @return Promise<DataType>
   */
  updateByCondition: (data: InputDataType) => Promise<DataType>
}

export default MysqlInterface