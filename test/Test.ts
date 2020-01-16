import { BaseDB, MysqlInterface, MySQLClient, DataType, InputDataType } from '../index'

const Client: MysqlInterface = new MySQLClient({
  host: 'yourhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'youdatabase',
  multipleStatements: true
})
Client.findOne({ sql: 'SELECT * FROM tb LIMIT 1' }).then(result => {
  console.log(result.data)
})

// =======================扩展node-mongodb示例===============================
interface MongoDBInterface {

}

class MongoDB extends BaseDB implements MongoDBInterface {
  destroy (conn?: DataType): void {
  }

  execute (data: object): Promise<DataType> {
    return undefined
  }

  getConnection (): Promise<DataType> {
    return undefined
  }

}
