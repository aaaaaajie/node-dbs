import { FilterQuery } from "mongodb";

interface oData {
  [propName: string]: any;
}

export class OutputDataType {
  private _hasError: boolean;
  private _message: any;
  private _data?: oData;

  constructor(hasError?: boolean, message?: any, data?: any) {
    this._hasError = hasError || false;
    this._message = message || '';
    this._data = data || null;
  }

  get hasError() { return this._hasError; }
  set hasError(hasError: boolean) { this._hasError = hasError; }

  get message() { return this._message; }
  set message(message) { this._message = message; }

  get data() { return this._data; }
  set data(data) { this._data = data; }
}

export interface QueryOptions<CT> {
  condition?: CT;
}
export interface RelationQueryOptions<CT> extends QueryOptions<CT> {

}

export interface NoRelationQueryOptions<CT> extends QueryOptions<CT> {

}

export interface MysqlQueryOptions extends RelationQueryOptions<any[]> {
  sql?: string;
  params?: object;
  limit?: number;
  order?: Array<any>;
  conn?: any;
}

export interface MongodbQueryOptions extends NoRelationQueryOptions<FilterQuery<any>> {
  collectionName: string;
}

export interface DBConfig {
  host: string;
  user?: string;
  port?: number;
  password?: string;
  database?: string;
  options?: any;
}
