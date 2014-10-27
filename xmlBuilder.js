var logging=require('./logging'),
    mustache = require('mustache');

exports.build = function(xml,davonki,res){
    return new Builder(xml,davonki,res);
}

function Builder(xml,davonki,res){
    this.xml = xml;
    this.davonki = davonki;
    this.res = res;
    this.templates = {
        "text": "<xml><ToUserName><![CDATA[{{ToUserName}}]]></ToUserName><FromUserName><![CDATA[{{FromUserName}}]]></FromUserName><CreateTime>{{CreateTime}}</CreateTime><MsgType><![CDATA[text]]></MsgType> <Content><![CDATA[{{Content}}]]></Content> </xml>",
        "video":"<xml><ToUserName><![CDATA[{{ToUserName}}]]></ToUserName><FromUserName><![CDATA[{{FromUserName}}]]></FromUserName><CreateTime>{{CreateTime}}</CreateTime><MsgType><![CDATA[video]]></MsgType><Video><MediaId><![CDATA[{{MediaId}}]]></MediaId><Title><![CDATA[{{Title}}]]></Title><Description><![CDATA[{{Description}}]]></Description></Video></xml>",
        "voice":"<xml><ToUserName><![CDATA[{{ToUserName}}]]></ToUserName><FromUserName><![CDATA[{{FromUserName}}]]></FromUserName><CreateTime>{{CreateTime}}</CreateTime><MsgType><![CDATA[voice]]></MsgType><Voice><MediaId><![CDATA[{{MediaId}}]]></MediaId></Voice></xml>",
        "image":"<xml><ToUserName><![CDATA[{{ToUserName}}]]></ToUserName><FromUserName><![CDATA[{{FromUserName}}]]></FromUserName><CreateTime>{{CreateTime}}</CreateTime><MsgType><![CDATA[image]]></MsgType><Image><MediaId><![CDATA[{{MediaId}}]]></MediaId></Image></xml>",
        "music":"<xml><ToUserName><![CDATA[{{ToUserName}}]]></ToUserName><FromUserName><![CDATA[{{FromUserName}}]]></FromUserName><CreateTime>{{CreateTime}}</CreateTime><MsgType><![CDATA[music]]></MsgType><Music><Title><![CDATA[{{Title}}]]></Title><Description><![CDATA[{{Description}}]]></Description><MusicUrl><![CDATA[{{&MusicUrl}}]]></MusicUrl><HQMusicUrl><![CDATA[{{&HQMusicUrl}}]]></HQMusicUrl></Music></xml>",
        "news": "<xml><ToUserName><![CDATA[{{ToUserName}}]]></ToUserName><FromUserName><![CDATA[{{FromUserName}}]]></FromUserName><CreateTime>{{CreateTime}}</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>{{ArticleCount}}</ArticleCount><Articles>$articles-mark</Articles></xml> ",
        "items":"{{#items}}<item><Title><![CDATA[{{Title}}]]></Title><Description><![CDATA[{{Description}}]]></Description><PicUrl><![CDATA[{{&PicUrl}}]]></PicUrl><Url><![CDATA[{{&Url}}]]></Url></item>{{/items}}"
    }
}

var agent = Builder.prototype;

agent.text = function(text){
    var data = {};
    data["Content"] = text;

    data["CreateTime"] = new Date().getTime();
    data["ToUserName"] = this.xml.FromUserName;
    data["FromUserName"] = this.xml.ToUserName;
    //console.log(mustache.render(this.templates.text,data));
    var raw_msg = mustache.render(this.templates.text,data);
    
    var msg_encrypt = this.davonki.encryptMsg(raw_msg);

    this.res.end(msg_encrypt);
}

agent.video = function(id){
    var data = {};
    data["MediaId"] = id;
    data["Title"] = "Latest video";
    data["Description"] = "This is the latest video from user uploads";

    data["CreateTime"] = new Date().getTime();
    data["ToUserName"] = this.xml.FromUserName;
    data["FromUserName"] = this.xml.ToUserName;

    var raw_msg = mustache.render(this.templates.video,data);

    this.res.end(this.davonki.encryptMsg(raw_msg));
}

agent.voice = function(id){
    var data = {};
    data["MediaId"] = id;

    data["CreateTime"] = new Date().getTime();
    data["ToUserName"] = this.xml.FromUserName;
    data["FromUserName"] = this.xml.ToUserName;

    var raw_msg = mustache.render(this.templates.voice,data);

    this.res.end(this.davonki.encryptMsg(raw_msg));
}

agent.image = function(id){
    var data = {};
    data["MediaId"] = id;

    data["CreateTime"] = new Date().getTime();
    data["ToUserName"] = this.xml.FromUserName;
    data["FromUserName"] = this.xml.ToUserName;

    var raw_msg = mustache.render(this.templates.image,data);

    this.res.end(this.davonki.encryptMsg(raw_msg));
}

agent.music = function(){
    var data = {};
    data["Title"] = "The little apple";
    data["Description"] = "小苹果";
    data["MusicUrl"] = "http://yinyueshiting.baidu.com/data2/music/123297915/1201250291413518461128.mp3?xcode=fbd5b74dd1a24fa90d512d7cb03c4c45a6a03c85c06f4409";
    data["HQMusicUrl"] = "http://yinyueshiting.baidu.com/data2/music/123297915/1201250291413518461128.mp3?xcode=fbd5b74dd1a24fa90d512d7cb03c4c45a6a03c85c06f4409";

    data["CreateTime"] = new Date().getTime();
    data["ToUserName"] = this.xml.FromUserName;
    data["FromUserName"] = this.xml.ToUserName;

    var raw_msg = mustache.render(this.templates.music,data);

    this.res.end(this.davonki.encryptMsg(raw_msg));
}

agent.news = function(){
    var data = {};
    data["ArticleCount"] = 3;
    var temp = mustache.render(this.templates.items,{"items":[
        {   "Title":"导航式聊天室",
            "Description":"A socket io embedded geo chatroom",
            "PicUrl":"http://www.hackfestindia.com/img/gallery/thumb/05.jpg",
            "Url":"geochat.mybluemix.net"
        },
        {   "Title":"女性，化妆品，八卦",
            "Description":"Look how ladies in east asia decorates their faces",
            "PicUrl":"http://www.qqw21.com/article/UploadPic/2012-9/201292582547652.jpg",
            "Url":"node-draw.mybluemix.net"
        },
        {   "Title":"音乐，时尚，跑酷",
            "Description":"Look how ladies in east asia decorates their faces",
            "PicUrl":"http://www.rockbackingtracks.co.uk/images/mj-3.gif",
            "Url":"weixinapi.mybluemix.net/video1.html"
        }
    ]});

    data["CreateTime"] = new Date().getTime();
    data["ToUserName"] = this.xml.FromUserName;
    data["FromUserName"] = this.xml.ToUserName;

    var raw_msg = mustache.render(this.templates.news,data).replace("$articles-mark",temp);

    this.res.end(this.davonki.encryptMsg(raw_msg));
};

var formatMessage = function (result) {
    var message = {};
    if (typeof result === 'object') {
        for (var key in result) {
            if (result[key].length === 1) {
                var val = result[key][0];
                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    message[key] = (val || '').trim();
                }
            } else {
                message = result[key].map(formatMessage);
            }
        }
    }
    return message;
};

exports.formatMessage = formatMessage;



/**
 * Created by Robin on 10/18/2014.
 */
