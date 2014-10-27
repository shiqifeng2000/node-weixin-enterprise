var http = require("http");
var wechat = require('./wechat');

http.createServer(function(req,res){
    console.log("[Incoming connection]: "+req.url);
    wechat.process(req, res);
}).listen(process.env.PORT || 3000);


/**
 * Created by Robin on 10/18/2014.
 */
