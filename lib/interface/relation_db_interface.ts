import { OutputDataType } from './datatype'
import BaseDBInterface from './base_db_interface'

interface RelationDBInterface extends BaseDBInterface {

  /**
   * 开启事务
   * @return Promise<DataType>
   */
  beginTransaction: () => Promise<OutputDataType>;

  /**
   * 事务回滚
   * @param conn
   * @return Promise<DataType>
   */
  rollbackTransaction: (conn) => Promise<OutputDataType>;

  /**
   * 事务提交
   * @param conn
   * @return Promise<DataType>
   */
  commitTransaction: (conn) => Promise<OutputDataType>;
}

export default RelationDBInterface