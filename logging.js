var fs = require('fs'),log_path="./log/logs.log";
exports.log = function (json){
    console.log(json);
    fs.appendFile(log_path,(typeof json == "object" ?JSON.stringify(json):json)+" \n", function (err) {
        if (err) throw err;
    });
}

exports.getLog = function (callback){
    fs.readFile(log_path, function (err, data) {
        if (err) throw err;
        callback(data);
    });
}

/**
 * Created by Robin on 10/19/2014.
 */
