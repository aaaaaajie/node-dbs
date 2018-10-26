
## 安装
```sh
$ npm install node-mysql-instance
```
## 使用方式:
1.创建数据库配置文件(DBConf.js)
```js
'use strict';
module.exports = {
    connectionLimit: 3,     // 连接池的最大连接数
    user: 'root',           // 数据库用户名
    password: '123456',     // 密码
    database: 'copy_book',  // 数据库名称
    host: '127.0.0.1',      // ip
    multipleStatements: true    // 允许多sql执行
}
```

2.测试文件 test.js
```js
const DBConf = require('./DBConf');
const MySQL = require('node-mysql-instance').getInstance(DBConf);

async function getUser(){
    let sql = "select * from user";
    console.log(await MySQL.query(sql));
}
getUser();
```

测试结果：

![](./测试结果.png '描述')




## GitHub链接地址

```js

[soundcode]: https://github.com/iPenManShip/node_mysql
```