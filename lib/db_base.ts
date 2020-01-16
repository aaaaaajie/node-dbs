import Logger from './logger'
import { DataType } from './IO_Data_interface'

/**
 * 数据库抽象类
 */
abstract class BaseDB {

  /* 数据库类型 */
  protected readonly _type: string

  /* 数据库配置 */
  private _config: object

  constructor (DBType: string, DBConf: object) {
    this._type = DBType
    this._config = DBConf
    this.test()
  }

  get config (): object {
    return this._config
  }

  set config (DBConf: object) {
    this._config = DBConf
  }

  /**
   * 测试连接
   */
  test (): void {
    this.getConnection().then((conn: DataType) => {
      console.log(`${this._type} connection successful!`)
      Logger.write(`${this._type} connection successful!`)
      this.destroy(conn)
    })
  }

  /**
   * 创建连接对象
   * @return Promise<object>
   */
  abstract getConnection (): Promise<DataType>

  /**
   * 销毁连接
   */
  abstract destroy (conn?: DataType): void

  /**
   * 数据库操作
   */
  abstract execute (data: object): Promise<DataType>
}

export default BaseDB
