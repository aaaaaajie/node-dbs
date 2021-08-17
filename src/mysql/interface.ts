import { RelationQueryOptions, RelationInsertOptions } from "../interface/datatype";

export interface MysqlQueryOptions extends RelationQueryOptions<any[]> {
    sql?: string;
    params?: object;
    limit?: number;
    order?: Array<any>;
    conn?: any;
}

export interface MysqlInsertOptions extends RelationInsertOptions {

}