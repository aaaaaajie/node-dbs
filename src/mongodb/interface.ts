import { NoRelationQueryOptions, InsertOptions } from "../interface/datatype";
import { FilterQuery, ObjectId } from "mongodb";
import { BaseEntity } from "./base.entity";

export interface MongodbQueryOptions extends NoRelationQueryOptions<FilterQuery<any>> {
    collectionName: string;
}

export interface MongodbInsertOptions extends InsertOptions {
    collectionName: string;
    doc: BaseEntity | BaseEntity[];
    _id?: ObjectId;
}