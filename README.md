## Install

```sh
$ npm install node-dbs
```

## Description

目前支持的数据库 mysql 

## Example usage

### js

```js
const { MySQLClient} = require('node-dbs')

const DBConf = {
    user: 'root',
    password: '123456',
    database: 'db',
    host: '127.0.0.1'
};

const client = new MySQLClient(DBConf);

client.query("select * from tb").then(result=>{
  console.log(result)
})
```

### TS

```ts
import { BaseDB, MysqlInterface, MySQLClient, DataType, InputDataType } from 'node-dbs'

const DBConf = {
  user: 'root',
  password: '123456',
  database: 'db',
  host: '127.0.0.1'
}
const client: MysqlInterface = new MySQLClient(DBConf: object)
client.query("select * from tb")).then(result=>{
  console.log(result)
})
```

## API Docs

**http://node-dbs.ipenman.top**

## GitHub 链接地址

[Github](https://github.com/iPenManShip/node-dbs)
