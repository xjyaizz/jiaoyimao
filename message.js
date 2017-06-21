var express = require("express");
var app = express();
var cheerio = require("cheerio");//cheerio可以看成node中的jquery
var superagent = require("superagent");
var url = require("url");//url是node自带的工具包
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html

var needUrl = "http://www.jiaoyimao.com/youxi/";

app.get("/",function(req,res){
    var data = [];
    superagent.get(needUrl).end(function(err,res){
        if(err){
            return console.log(err);
        }
        var $ = cheerio.load(res.text);
        console.log($("#scrollMain").find(".select-item").length);
        $("#scrollMain").find(".select-item").each(function(i,items){
            var msgobj = {};
            msgobj.title = $(items).find(".title").text();
            msgobj.list = [];
            $(items).find(".game-list").find("li").each(function(i,items){
                var gamelist = {};
                gamelist.urls = $(items).find(".pic>a").attr("href");
                gamelist.names = $(items).find("div.name").find("a>h2").text();
                gamelist.imgurl = $(items).find(".pic>a").find("img").attr("src");
                gamelist.infos = [];
                $(items).find(".info").find("a").each(function(i,items){
                    var infolist = {};
                    infolist.titles = $(items).attr("title");
                    infolist.urls = $(items).attr("href");
                    gamelist.infos.push(infolist);
                })
                msgobj.list.push(gamelist);
            })
            data.push(msgobj);
        })
        console.log(JSON.stringify(data));
    })
    setTimeout(function(){
        res.send(data);
    },15000)
})

app.listen(3333,function(){
    console.log("server is run in 3333");
})
