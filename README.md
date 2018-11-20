# Quick Restful Api Server

本项目主要目的在于快速搭建一个可以提供 Restful Api 的服务器。

## 缘起

本来用 redmine 做了一个服务器，利用他提供的 Http Restful Api 来做接口，这样自己就只需要写写前端页面，放在服务器某个目录上，就有了一整套完整的东西，包括后台界面、用户、用户组、权限管理等等高级功能都有了，感觉自己好机智。

这样做的好处就是：省事，省事，非常省事。看看 redmine 的文档，配置配置项目，添加一些自定义的字段，几乎小需求都能快速搞定。而且 redmine 开源框架，用了半年左右稳定性还挺好的，没啥大问题。

但是！！！某些需求实现起来速度非常慢。redmine 本身是一个 issues 管理系统，而且现成的框架必然有既定数据结构的限制，导致某些问题下生成的 sql 很复杂。目前遇到的一个坑就是，在 Http 某一个查询中，其中有两个 Sql 花了将近 2s，导致页面需要 4s+ 才能刷出数据。

问题来了，咋办呢？各种挣扎。

+ ~~修改 redmine 的代码~~： 要学习 ruby，新语言新框架，加在一起时间太长，直接 pass。
+ **优化数据库**：加了索引，效果并不明显，而且由于学艺不精，光是查找服务器到底执行了哪些 sql，那几句 sql 花了这么长时间，费了老大劲！其间连重启服务器都尝试了，这条路走起来也不容易。
+ 其中需求并不复杂，经过简化后，必须的 sql 只有两个，sql1 查询数据集总条目数，sql2 查询排序后的数据集中的某一段，其中 sql1 花费 1s 多，貌似是 count 比较耗时，但是 sql2 只需要几十毫秒，这样的话还是有**救的**

## 决定

如果我有一个 http server 可以直接访问数据库，查询这两个接口，直接返回需要的数据就好了，那就动手吧。

作为前段狗的选择，当然是：**nodejs** 中的 **express**

## 具体步骤

如果你想在本地使者运行一下，那你需要这些步骤：

1. 安装 node + npm，如果你不知道这俩哥们，可以参考下：

    [安装Node.js和npm](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/00143450141843488beddae2a1044cab5acb5125baf0882000)，[nodejs官网](https://nodejs.org/en/)


2. 下载这个工程，或者 `git clone`，既然都是在 github 上了，就不解释太多了。
3. 工程目录下运行 `npm install`
4. 工程目录下运行 `npm run start`
5. 可以直接在浏览器地址栏输入、或者用 postman 等这样的接口工具测试 `http://localhost:8889/hello`
6. 添加数据源
7. 添加接口



## 开发便捷助手

### 1. [nodemon](http://nodemon.io/) 监听文件修改，自动重启服务器。

`npm install nodemon --save-dev`

`package.json` 中添加 

```json
{
  ...
  "scripts": {
    "start": "nodemon server.js"
  },
  ...
}
```

运行 `npm run start`

在项目目录下可以添加配置文件 `nodemon.json` 或者在 `package.json` 中添加 `nodemonConfig` 字段。

* restartable-设置重启模式 
* ignore-设置忽略文件 
* verbose-设置日志输出模式，true 详细模式 
* execMap-设置运行服务的后缀名与对应的命令 
    `{ "js": "node –harmony" }` 表示使用 nodemon 代替 node 
* watch-监听哪些文件的变化，当变化的时候自动重启 
* ext-监控指定的后缀文件名

### 2. [forever](https://github.com/foreverjs/forever) 长期运行命令的工具

`npm install forever -g`



## todo

+ 添加不同的数据源 ： file mysql sqlite nosql
+ 配置不同的数据源
+ 如何添加接口


