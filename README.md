## 安装

```sh
$ npm install node-mysql-instance
```

## Example usage

### js

```js
const { Mysql} = require('node-mysql-instance')

const DBConf = {
    connectionLimit: 3,     // 连接池的最大连接数
    user: 'root',           // 数据库用户名
    password: '123456',     // 密码
    database: 'db',  // 数据库名称
    host: '127.0.0.1',      // ip
    multipleStatements: true    // 允许多sql执行
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
  connectionLimit: 3, // 连接池的最大连接数
  user: 'root', // 数据库用户名
  password: '123456', // 密码
  database: 'db', // 数据库名称
  host: '127.0.0.1', // ip
  multipleStatements: true // 允许多sql执行
}
const client: DBInterface = new Mysql(DBConf: object)
client.query("select * from tb")).then(result=>{
  console.log(result)
})
```

## API Docs

**ndbc.ipenman.top**

## GitHub 链接地址

```js

[soundcode]: https://github.com/iPenManShip/node-mysql-instance
```
