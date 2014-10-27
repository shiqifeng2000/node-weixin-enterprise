var agent = require('./agent'), handler = require('./messageHandler');



 var assistantHandler = handler.text;
 var xml = {"Content":["news"],"CreateTime":["2"],"ToUserName":["3"],"FromUserName":["4"],"items":[{"Title":""}]};
 assistantHandler(xml,agent.agent(xml, {"x":1}));


//require('mustache').render("<xml><ToUserName><![CDATA[{{ToUserName}}]]></ToUserName><FromUserName><![CDATA[{{FromUserName}}]]></FromUserName><CreateTime>{{CreateTime}}</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>{{ArticleCount}</ArticleCount><Articles>{{#items}}<item><Title><![CDATA[{{Title}}]]></Title><Description><![CDATA[{{Description}}]]></Description><PicUrl><![CDATA[{{PicUrl}}]]></PicUrl><Url><![CDATA[{{Url}}]]></Url></item>{{/items}}</Articles></xml>", {})
/*
console.log(require('mustache').render("<xml>{{#stooges}}<b>{{name}}</b>{{/stooges}}</xml>",{
    "stooges": [
        { "name": "Moe" },
        { "name": "Larry" },
        { "name": "Curly" }
    ]
}))*/
/**
 * Created by Robin on 10/19/2014.
 */
