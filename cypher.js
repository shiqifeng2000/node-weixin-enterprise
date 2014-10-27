/*
 var sToken = "QDG6eK",
 sCorpID = "wx5823bf96d3bd56c7",
 sEncodingAESKey = "jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C";
 */

var crypto = require('crypto'),
    logging = require('./logging');
xml2js = require('xml2js'),
    parser = new xml2js.Parser(),
    mustache = require('mustache'),
    agent = require('./xmlBuilder'),
    encryptTemplate = "<xml><Encrypt><![CDATA[{{&Encrypt}}]]></Encrypt><MsgSignature><![CDATA[{{&MsgSignature}}]]></MsgSignature><TimeStamp>{{TimeStamp}}</TimeStamp><Nonce><![CDATA[{{Nonce}}]]></Nonce></xml>"

exports.davonki = function (sToken, sCorpID, sEncodingAESKey, sAgentID) {
    return new Davonki(sToken, sCorpID, sEncodingAESKey, sAgentID);
}

// please decode the url before initializing this function
function Davonki(sToken, sCorpID, sEncodingAESKey, sAgentID) {
    this.token = sToken;
    this.corpID = sCorpID;
    this.aesKey = new Buffer(sEncodingAESKey + '=', 'base64');
    this.iv = this.aesKey.slice(0, 16);
    this.agentID = sAgentID;
}

Davonki.prototype.verifyURL = function (msgSignature, timestamp, nonce, echostr) {
    var result = "";
    if (this.getSignature(timestamp, nonce, echostr) == msgSignature) {
        console.log("signature matched: " + msgSignature);
        result = this.decrypt(echostr);
    }

    return result;
}

Davonki.prototype.decryptMsg = function (msgSignature, timestamp, nonce, xml, next) {
    var result = "error";
    if (xml.ToUserName != this.corpID || xml.AgentID != this.agentID) {
        return result;
    }

    var msg_encrypt = xml.Encrypt;

    if (this.getSignature(timestamp, nonce, msg_encrypt) == msgSignature) {
        console.log("signature matched: " + msgSignature);
        logging.log(msg_encrypt);
        result = this.decrypt(msg_encrypt);

        parser.parseString(result, function (err, underwear) {
            if (err) {
                console.log(err);
            }

            next(agent.formatMessage(underwear.xml));
        });
    }

    return result;
}

Davonki.prototype.encryptMsg = function (replyMsg) {
    var wrap = {};
    logging.log(replyMsg)
    wrap.Encrypt = this.encrypt(replyMsg);
    wrap.Nonce = parseInt((Math.random() * 100000000000), 10);
    wrap.TimeStamp = new Date().getTime();

    wrap.MsgSignature = this.getSignature(wrap.TimeStamp, wrap.Nonce, wrap.Encrypt);

    var finalXML =  mustache.render(encryptTemplate, wrap);
    logging.log(wrap.Encrypt)
    logging.log(finalXML);
    return finalXML;
}

Davonki.prototype.encrypt = function (xmlMsg) {
    console.log("encrypting : ")
    var random16 = crypto.pseudoRandomBytes(16);

    var msg = new Buffer(xmlMsg);

    var msgLength = new Buffer(4);
    msgLength.writeUInt32BE(msg.length, 0);

    var corpId = new Buffer(this.corpID);

    var raw_msg = Buffer.concat([random16,msgLength,msg ,corpId]);//randomString + msgLength + xmlMsg + this.corpID;
   // logging.log(raw_msg.toString());
    var encoded = PKCS7Encoder(raw_msg);
   // logging.log(encoded.toString());
    var cipher = crypto.createCipheriv('aes-256-cbc', this.aesKey, this.iv);
    //cipher.setAutoPadding(false);

    var cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);

    var finalResult = cipheredMsg.toString('base64');
    //logging.log(finalResult);
    return finalResult;
}

Davonki.prototype.decrypt = function (str) {
    console.log("decrypting : ")
    var aesCipher = crypto.createDecipheriv("aes-256-cbc", this.aesKey, this.iv);
    aesCipher.setAutoPadding(false);
    var decipheredBuff = Buffer.concat([aesCipher.update(str, 'base64'), aesCipher.final()]);

    decipheredBuff = PKCS7Decoder(decipheredBuff);

    var len_netOrder_corpid = decipheredBuff.slice(16);

    var msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0);
    //recoverNetworkBytesOrder(len_netOrder_corpid.slice(0, 4));

    var result = len_netOrder_corpid.slice(4, msg_len + 4).toString();

    var corpId = len_netOrder_corpid.slice(msg_len + 4).toString();

    console.log("corp id: " + corpId);
    if (corpId == this.corpID) {
        return result;
    }

    return "error"
}

Davonki.prototype.getSignature = function (timestamp, nonce, encrypt) {
    var raw_signature = [this.token, timestamp, nonce, encrypt].sort().join('');

    var sha1 = crypto.createHash("sha1");
    sha1.update(raw_signature);

    return sha1.digest("hex");
};

function PKCS7Decoder(buff) {
    var pad = buff[buff.length - 2];

    if (pad < 1 || pad > 32) {
        pad = 0;
    }

    return buff.slice(0, buff.length - pad);
};

function PKCS7Encoder(buff) {
    var blockSize = 32;
    var strSize = buff.length;
    var amountToPad = blockSize - (strSize % blockSize);

    var pad = new Buffer(amountToPad-1);
    pad.fill(String.fromCharCode(amountToPad));

    return Buffer.concat([buff, pad]);
};


/**
 * Created by Robin on 10/25/2014.
 */
