var mysql = require("mysql");
var mysqlConf = require("./mysqlConf");
var pool = mysql.createPool(mysqlConf);

module.exports = function (sql){
    return new Promise(function(resolve, reject){
        pool.query(sql, function (error, results, fields) {
            if (error) throw error;
            resolve(results);
        });
    });
} 