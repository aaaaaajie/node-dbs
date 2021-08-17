import Logger from '../interface/logger';
import { OutputDataType, DBConfig } from '../interface/datatype';

/**
 * 数据库抽象类
 */
abstract class BaseDB {

  /* 数据库类型 */
  protected readonly _type: string;

  /* 数据库配置 */
  private _config: DBConfig;

  protected _isPrintLog: boolean;

  constructor(DBType: string, DBConf: DBConfig, isPrintLog: boolean = false) {
    this._type = DBType;
    this._config = DBConf;
    this._isPrintLog = isPrintLog;
    this.test();
  }

  get config(): DBConfig {
    return this._config;
  }

  set config(DBConf: DBConfig) {
    this._config = DBConf;
  }

  /**
   * 测试连接
   */
  test(): void {
    this.getConnection().then((conn: OutputDataType) => {
      console.log(`${this._type} connection successful!`);
      if (this._isPrintLog) {
        Logger.write(`${this._type} connection successful!`, "debug");
      }

      this.destroy(conn);
    });
  }

  /**
   * 创建连接对象
   * @return Promise<object>
   */
  abstract getConnection(): Promise<OutputDataType>;

  /**
   * 销毁连接
   */
  abstract destroy(conn?: OutputDataType): void;

}

export default BaseDB;
