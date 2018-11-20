var express = require('express');
var mysql = require("mysql");
var mysqlConf = require("./mysqlConf").mysql;
var app = express();
var port = process.env.PORT || 8889;
app.listen(port);

var pool = mysql.createPool(mysqlConf);

app.options("*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-redmine-api-key');
    res.send(200);
});

app.get('/news/total_count', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-redmine-api-key');
    var limit = req.query.limit;
    var offset = req.query.offset;
    var cf_9 = req.query.cf_9;
    var cf_10 = req.query.cf_10;
    var arr = cf_10.split('|');
    var cf_10_str = arr.map(function(v){return "'" + v + "'"}).toString()

    var resultData = {
        limit: limit,
        offset: offset
    }

    // -- issues []
    // -- total_count: 4020
    var sql = `select count(*) AS total_count from news_helper
    where c9_value IN ('${cf_9}') AND 
    c10_value IN (${cf_10_str});`

    var promise = new Promise(function(resolve, reject){
        pool.query(sql, function (error, results, fields) {
            if (error) throw error;
            resolve(results[0]['total_count']);
        });
    });
    promise.then(function(data){
        resultData.total_count = data;
        res.send(resultData);
    })
});

app.get('/news/issues', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-redmine-api-key');
    var limit = req.query.limit;
    var offset = req.query.offset;
    var cf_9 = req.query.cf_9;
    var cf_10 = req.query.cf_10;
    var arr = cf_10.split('|');
    var cf_10_str = arr.map(function(v){return "'" + v + "'"}).toString()

    var resultData = {
        limit: limit,
        offset: offset
    }

    var sql = `select * from news_helper
    where c9_value IN ('${cf_9}') AND 
    c10_value IN (${cf_10_str}) ORDER BY start_date DESC
    LIMIT ${limit} OFFSET ${offset};`

    var promise = new Promise(function(resolve, reject){
        pool.query(sql, function (error, results, fields) {
            if (error) throw error;
            resolve(results);
        });
    });
    promise.then(function(datas) {
        resultData.issues = datas;
        res.send(resultData);
    });
});