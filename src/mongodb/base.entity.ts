import { ObjectId } from "mongodb";

export class BaseEntity {
    public _id: ObjectId;

    constructor() {
    }
}