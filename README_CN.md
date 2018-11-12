
## 安装
```sh
$ npm install node-mysql-instance
```
## 使用方式:

```js
const DBConf = {
    connectionLimit: 3,     // 连接池的最大连接数
    user: 'root',           // 数据库用户名
    password: '123456',     // 密码
    database: 'copy_book',  // 数据库名称
    host: '127.0.0.1',      // ip
    multipleStatements: true    // 允许多sql执行
};

const MySQL = require("node-mysql-instance");
MySQL.setConf(DBConf);
const client = MySQL.getInstance();

(async ()=>console.log(await MySQL.query("select * from user"))});
```

测试结果：

![](./测试结果.png '描述')




## GitHub链接地址

```js

[soundcode]: https://github.com/iPenManShip/node_mysql
```