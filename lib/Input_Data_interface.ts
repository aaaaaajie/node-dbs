export interface InputDataType {
  sql: string
  params?: object
  limit?: number
  order?: Array<any>
  condition?: Array<any>
  conn?: any
}
