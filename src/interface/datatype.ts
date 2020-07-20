interface oData {
  [propName: string]: any
}

export interface OutputDataType {
  hasError: boolean;
  message: any;
  data?: oData;
}

export interface InputDataType {
  sql: string
  params?: object
  limit?: number
  order?: Array<any>
  condition?: Array<any>
  conn?: any
}
