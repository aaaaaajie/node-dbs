"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbClient = void 0;
const mongodb_1 = require("mongodb");
const base_1 = require("./entity/base");
const datatype_1 = require("./interface/datatype");
const utils_1 = require("./utils");
class MongodbClient extends base_1.default {
    constructor(DBConf) {
        if (typeof DBConf === "string") {
            // mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]      
            const regexp = /^mongodb:\/\/([a-zA-Z0-9]*):?([a-zA-Z0-9]*)@?([a-zA-Z0-9]*):?(\d{0,5})\/([a-zA-Z0-9]+)\??(\S*)/;
            const fullConfig = DBConf.match(regexp);
            if (fullConfig.length < 7)
                throw new Error("Database validation failed");
            const database = fullConfig[5];
            const options = fullConfig[6];
            const userPwdHostPort = fullConfig.filter((x, i) => i !== 0 && i < 5 && Boolean(x));
            let user, password, host, port;
            /*******************************************************************
             ********** 筛选过后的数组有以下情况：***********************************
             ********** 1.所有配置都填入，配置长度为4，user、pwd、host、port**********
             ********** 2.user和pwd必须是成组出现，若没有则配置长度为2，host、port ****
             ********** 3.user、pwd、port均为空，则长度为1，host *******************
             ********************************************************************
             */
            switch (userPwdHostPort.length) {
                case 4:
                    user = userPwdHostPort[0];
                    password = userPwdHostPort[1];
                    host = userPwdHostPort[2];
                    port = userPwdHostPort[3];
                    break;
                case 3:
                    user = userPwdHostPort[0];
                    password = userPwdHostPort[1];
                    host = userPwdHostPort[2];
                    port = 27017;
                    break;
                case 2:
                    host = userPwdHostPort[0];
                    port = userPwdHostPort[1];
                    break;
                case 1:
                    host = userPwdHostPort[0];
                    port = 27017;
                    break;
                default:
                    throw new Error("Database validation failed：username、password、port or host");
            }
            DBConf = { host, user, password, database, options };
        }
        super(`mongodb`, {
            user: DBConf.user,
            password: DBConf.password,
            host: DBConf.host || "127.0.0.1",
            port: DBConf.port || 27017,
            database: DBConf.database,
            options: DBConf.options || {}
        });
        this.getConnection().then(() => { });
    }
    uriParseToObj(config) {
        return;
    }
    objParseToUri(config) {
        if (typeof config === "string")
            return config;
        const { user, password, host, port, database, options } = config;
        let uri = `mongodb://`;
        if (user && password)
            uri = `${uri}${user}:${password}@`;
        if (!host)
            throw new Error("Hostname is exist");
        uri += host;
        port ? (uri += `:${port}`) : (uri += ":27017");
        uri += `/${database}`;
        return { uri, options };
    }
    getConnection() {
        const { uri, options } = this.objParseToUri(this.config);
        return new Promise(resolve => {
            mongodb_1.MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
                if (err)
                    throw err;
                this._db = client.db(this.config.database);
            });
        });
    }
    destroy(conn) {
        return null;
    }
    execute(data) {
        return Promise.resolve(new datatype_1.OutputDataType(false, "", "The function not please use other functions"));
    }
    async find(data) {
        return await utils_1.retResult(this._db.collection(data.collectionName).find(data.condition).toArray());
    }
}
exports.MongodbClient = MongodbClient;
exports.default = MongodbClient;
