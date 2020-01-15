## Install

```sh
$ npm install node-mysql-instance
```

## Description

目前支持的数据库 mysql 

## Example usage

### js

```js
const { Mysql} = require('node-mysql-instance')

const DBConf = {
    user: 'root',
    password: '123456',
    database: 'db',
    host: '127.0.0.1'
};

const client = new Mysql(DBConf);

client.query("select * from tb")).then(result=>{
  console.log(result)
})
```

### TS

```ts
import { Mysql, DBInterface, DataType  } from 'node-mysql-instance'

const DBConf = {
  user: 'root',
  password: '123456',
  database: 'db',
  host: '127.0.0.1'
}
const client: DBInterface = new Mysql(DBConf: object)
client.query("select * from tb")).then(result=>{
  console.log(result)
})
```

## API Docs

**http://ndbc.ipenman.top**

## GitHub 链接地址

```js

[soundcode]: https://github.com/iPenManShip/node-mysql-instance
```
