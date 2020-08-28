import { QueryOptions, OutputDataType } from './datatype';

interface BaseInterface {

  /**
   * 查询单项
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  findOne: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /**
   * 查询列表
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  find: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /**
   * 修改
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  update: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /**
   * 插入
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  insert: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /**
   * 删除
   * @param sql
   * @param params
   * @param conn
   * @return Promise<DataType>
   */
  delete: (data: QueryOptions<any>) => Promise<OutputDataType>;

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
  page: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /***************************
   ** 获取条件请求对象
   ** 返回参数operator说明：
   ** = < > !=
   ** liftlike: like %str
   ** rigthlike: like %str
   ** doublelike: like %str%
   ** @return object
   ***************************/
  getFindByConditionData: () => object;

  /**
   * 拼接order
   * @param str
   * @param item order对象
   * @param bl 是否加order by关键字
   * @return string
   */
  order: (str: string, item: { sort?, column?: string; }, bl: boolean) => string;

  /**
   * 拼接sql
   * @param data
   * @return string
   */
  concatCondition: (data: { condition: Array<any>; params: object; sql: string; }) => string;

  /**
   * 按条件查询
   * @param data
   * @return Promise<DataType>
   */
  findByCondition: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /**
   * 按条件修改
   * @param data
   * @return Promise<DataType>
   */
  updateByCondition: (data: QueryOptions<any>) => Promise<OutputDataType>;
}

export default BaseInterface;