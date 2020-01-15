interface oData {
  [propName: string]: any
}

export interface DataType {
  hasError: boolean;
  message: any;
  data?: oData;
}
