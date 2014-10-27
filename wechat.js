var querystring = require('querystring'),
    cypher = require('./cypher'),
    url = require('url'),
    xml2js = require('xml2js'),
    logging = require('./logging'),
    agent = require('./xmlBuilder'),
    handler = require('./messageHandler'),
    parser = new xml2js.Parser(),
    _TOKEN = "GDC",
    _CORPID = 'wx606d707c8d2557a6',
    _ENCODINGAESKEY = "4NYuF7hY41dUINoadwx8FXohSD9lRQukg5CWV53KVPN",
    _AGENTID = "1",
    query,
    davonki = cypher.davonki(_TOKEN, _CORPID, _ENCODINGAESKEY, _AGENTID);



function process(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var param = req.url.split("?")[1];
    query = param ? querystring.parse(param) : {};
    if (req.method == "GET") {
        onGet(req, res, next);
    } else {
        onPost(req, res, next);
    }
}

function onGet(req, res, next) {
    logging.log("[GET]:" + req.url);
    var path = url.parse(req.url).pathname;
    var sVerifyMsgSig = decodeURI(query.msg_signature);
    var sVerifyTimeStamp = decodeURI(query.timestamp);
    var sVerifyNonce = decodeURI(query.nonce);
    var sVerifyEchoStr = decodeURI(query.echostr);

    var verifyResult = davonki.verifyURL(sVerifyMsgSig, sVerifyTimeStamp, sVerifyNonce, sVerifyEchoStr);

    if (path == '/log') {
        logging.getLog(function (data) {
            res.end(data)
        });
    } else {
        res.end(verifyResult);
    }
}

function onPost(req, res, next) {
    logging.log("[POST]:" + req.url);
    var sea = "";
    req.addListener("data", function (water) {
        sea += water;
    });

    req.addListener("end", function () {
        parser.parseString(sea, function (err, result) {
            logging.log("[POST body]:" + result);
            if (err) {
                logging.log(err);
            }

           var xml = agent.formatMessage(result.xml);

            var sVerifyMsgSig = decodeURI(query.msg_signature);
            var sVerifyTimeStamp = decodeURI(query.timestamp);
            var sVerifyNonce = decodeURI(query.nonce);

            davonki.decryptMsg(sVerifyMsgSig, sVerifyTimeStamp, sVerifyNonce, xml, function (json) {
                var assistantHandler = handler[json.MsgType];
                if (assistantHandler && (typeof assistantHandler == "function")) {
                    res.writeHead(200, {
                        'Content-Type': 'text/xml'
                    });
                    assistantHandler(json, agent.build(json, davonki, res));
                }
            });
        });
    });
}

exports.process = process;


/**
 * Created by Robin on 10/18/2014.
 */
