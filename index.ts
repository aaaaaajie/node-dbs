// import { MysqlQueryOptions, OutputDataType, MongodbQueryOptions, NoRelationQueryOptions, RelationQueryOptions } from './src/interface/datatype';
import BaseDB from './src/entity/base';
import BaseInterface from './src/interface/base_db_interface';
import MysqlInterface from './src/interface/relation_db_interface';
import MysqlClient from './src/mysql';
// import { MongodbClient } from "./src/mongodb";

export * from "./src/mongodb";
export * from "./src/interface/datatype";

export {
    BaseDB,
    BaseInterface,
    MysqlInterface,
    MysqlClient,
};