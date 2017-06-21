var express = require("express");
var app = express();
var cheerio = require("cheerio");//cheerio可以看成node中的jquery
var superagent = require("superagent");//superagent(http://visionmedia.github.io/superagent/ ) 是个 http 方面的库，可以发起 get 或 post 请求
var url = require("url");//url是node自带的工具包
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html

var needUrl = "http://www.jiaoyimao.com/youxi/";

app.get("/",function(req,res){//使用express主要是为了搭一个服务器，把数据放到页面上展示
    //向大佬学习。使用变量保存相应返回的res对象，在之后数据爬取时避免异步而拿不到数据
    //使用变量在爬取信息完毕的回调里发送展示数据
    var dsres = res;
    var data = [];//最终要存放数据的数组
    superagent.get(needUrl).end(function(err,res){//使用superagent发起请求，获得页面信息
        if(err){//如果有错误信息则打印
            return console.log(err);
        }
        var $ = cheerio.load(res.text);//这里使用cheerio的load方法处理页面，变为类jquery对象QAQ，应该就是这个意思。。
        console.log($("#scrollMain").find(".select-item").length);
        //分析页面结构得出，页面布局的数据所在的地方是$("#scrollMain")下面的各个 .select
        $("#scrollMain").find(".select-item").each(function(i,items){//下面就是一些数据的处理
            //这里定义了一个总的对象来存放单个商品的信息
            var msgobj = {};
            //title是游戏商品的总的分类，热门游戏或A-Z
            msgobj.title = $(items).find(".title").text();
            //list是当前游戏分类下的商品的所有的游戏列表的存放
            msgobj.list = [];
            $(items).find(".game-list").find("li").each(function(i,items){//这里开始遍历当前分类下的所有游戏
                //同样是定义一个对象用来存放单个游戏的信息
                var gamelist = {};
                //游戏商品详情的url
                gamelist.urls = $(items).find(".pic>a").attr("href");
                //游戏商品的名字
                gamelist.names = $(items).find("div.name").find("a>h2").text();
                //游戏商品的图片的地址
                gamelist.imgurl = $(items).find(".pic>a").find("img").attr("src");
                //infos是为了存放游戏商品下的分类，例如首充帐号、游戏币、帐号、道具等等
                gamelist.infos = [];
                $(items).find(".info").find("a").each(function(i,items){//这里遍历游戏商品下的分类
                    //同样道理定义对象来存放信息
                    var infolist = {};
                    infolist.titles = $(items).attr("title");
                    infolist.urls = $(items).attr("href");
                    //这里开始放置信息，把商品的分类信息等存到infos
                    gamelist.infos.push(infolist);
                })
                //将当前商品的信息存放到对应的商品分类
                msgobj.list.push(gamelist);
            })
            //将当前分类的所有商品信息存放到总的数组data当中
            data.push(msgobj);
        })
        //可以看一下所有信息。。。不过没什么用。太多了
        console.log(JSON.stringify(data));
        //之上的变量存放
        dsres.send(data);
    })
    
})

app.listen(3333,function(){
    console.log("server is run in 3333");
})
