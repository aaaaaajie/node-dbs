// import MySQL from './lib/mysql'
import { Mysql, DBInterface, DataType } from '../index'

const Client: Mysql = new Mysql({
  host: 'xxx',
  user: 'root',
  password: 'xxx',
  database: 'xxx',
  multipleStatements: true
})
Client.findOne('SELECT * FROM tb LIMIT 1').then(result => {
  console.log(result.data)
})

class SqlServer implements DBInterface {
  beginTransaction: () => Promise<DataType>
  commitTransaction: (conn) => Promise<DataType>
  concatCondition: (data: { sql: string; condition: Array<any>; params: object }) => string
  delete: (sql: string, params: object, conn?) => Promise<DataType>
  find: (sql: string, params: object, conn?) => Promise<DataType>
  findByCondition: (data: { sql: string; condition: Array<any>; params?: object; order?: Array<any>; limit?: number }, conn?) => Promise<DataType>
  findOne: (sql: string, params?: object, conn?) => Promise<DataType>
  getFindByConditionData: () => object
  insert: (sql: string, params: object, conn?) => Promise<DataType>
  order: (str: string, item: { sort?; column?: string }, bl: boolean) => string
  page: (sql: string, values: object, limit: number, conn?) => Promise<DataType>
  query: (sql: string, params: object, conn?) => Promise<DataType>
  rollbackTransaction: (conn) => Promise<DataType>
  update: (sql: string, params: object, conn?) => Promise<DataType>
  updateByCondition: (data: { sql: string; condition: Array<any>; params: object }, conn?) => Promise<DataType>
}