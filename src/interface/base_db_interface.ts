import { QueryOptions, OutputDataType, InsertOptions, UpdateOptions, DeleteOptions } from './datatype';

interface BaseInterface {

  /**
   * 查询单项
   * @param sql
   * @param params
   * @param conn
   * @return Promise<OutputDataType>
   */
  findOne: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /**
   * 查询列表
   * @param sql
   * @param params
   * @param conn
   * @return Promise<OutputDataType>
   */
  find: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /**
   * 修改
   * @param sql
   * @param params
   * @param conn
   * @return Promise<OutputDataType>
   */
  update: (data: UpdateOptions<any, any>) => Promise<OutputDataType>;

  /**
   * 插入单项
   * @param data
   * @return Promise<OutputDataType>
   */
  updateOne: (data: UpdateOptions<any, any>) => Promise<OutputDataType>;

  /**
   * 修改多条
   * @param data
   * @return Promise<OutputDataType>
   */
  updateMany: (data: UpdateOptions<any, any>) => Promise<OutputDataType>;

  /**
   * 插入
   * @param sql
   * @param params
   * @param conn
   * @return Promise<OutputDataType>
   */
  insert: (data: InsertOptions) => Promise<OutputDataType>;

  /**
   * 删除
   * @param data
   * @return Promise<OutputDataType>
   */
  delete: (data: QueryOptions<any>) => Promise<OutputDataType>;


  /**
   * 删除单条
   * @param data
   * return Promise<OutputDataType>
   */
  deleteOne: (data: DeleteOptions<any>) => Promise<OutputDataType>;

  deleteMany: (data: DeleteOptions<any>) => Promise<OutputDataType>;

  /**
   * 分页
   * @param sql
   * @param values
   * values:{
   *   otherKey:otherVal,
   *   Limit:[0,5]
   * }
   * @return Promise<OutputDataType>
   */
  page: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /***************************
   ** 获取条件请求对象
   ** 返回参数operator说明：
   ** = < > !=
   ** liftlike: like %str
   ** rightlike: like %str
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
  order: (str: string, item: { sort?: any[][], column?: string; }, bl: boolean) => string;

  /**
   * 拼接sql
   * @param data
   * @return string
   */
  concatCondition: (data: { condition: Array<any>; params: object; sql: string; }) => string;

  /**
   * 按条件查询
   * @param data
   * @return Promise<OutputDataType>
   */
  findByCondition: (data: QueryOptions<any>) => Promise<OutputDataType>;

  /**
   * 按条件修改
   * @param data
   * @return Promise<OutputDataType>
   */
  updateByCondition: (data: QueryOptions<any>) => Promise<OutputDataType>;
}

export { BaseInterface };
export default BaseInterface;