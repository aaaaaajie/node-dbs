import { InputDataType, OutputDataType, BaseDB, BaseInterface, MysqlInterface, MysqlClient } from '../index'

const Client: MysqlInterface = new MysqlClient({
  host: 'rm-wz989c60z42kpw9s9ro.mysql.rds.aliyuncs.com',
  user: 'root',
  password: 'P@ssWord',
  database: 'blog',
  multipleStatements: true
})
Client.findOne({ sql: 'SELECT * FROM user LIMIT 1' }).then(result => {
  console.log(result.data)
})

// =======================扩展node-mongodb示例===============================
interface MongoDBInterface extends BaseInterface {

}

class MongoDB extends BaseDB implements MongoDBInterface {
  destroy (conn?: OutputDataType): void {
  }

  execute (data: object): Promise<OutputDataType> {
    return undefined
  }

  getConnection (): Promise<OutputDataType> {
    return undefined
  }

  concatCondition: (data: { condition: Array<any>; params: object; sql: string }) => string
  delete: (data: InputDataType) => Promise<OutputDataType>
  find: (data: InputDataType) => Promise<OutputDataType>
  findByCondition: (data: InputDataType) => Promise<OutputDataType>
  findOne: (data: InputDataType) => Promise<OutputDataType>
  getFindByConditionData: () => object
  insert: (data: InputDataType) => Promise<OutputDataType>
  order: (str: string, item: { sort?; column?: string }, bl: boolean) => string
  page: (data: InputDataType) => Promise<OutputDataType>
  update: (data: InputDataType) => Promise<OutputDataType>
  updateByCondition: (data: InputDataType) => Promise<OutputDataType>

}
