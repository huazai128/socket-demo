var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
var path = require("path");
var MongoStore = require("connect-mongo")(session);
var signedCookieParser = cookieParser("VDSDN-VSVDVN-VDVD");


var app = express();

//配置文件
var config =  require("./config/config");
var socketApi = require("./router/socketApi");

var port = process.env.PORT || 3000;

//session store
var sessionStore = new MongoStore({
    url:"mongodb://localhost/store"
});

//中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:"VDSDN-VSVDVN-VDVD",
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge: 60 * 60 * 1000 },
    store:sessionStore
}));

//静态文件
app.use(express.static(path.join(__dirname,"static")));

require("./router")(app);

var server = app.listen(port,function(){
    console.log("Listening :" + port);
});

//socket的服务端连接
var io = require("socket.io").listen(server);

//用于共享session，并且用于验证身份
io.set("authorization",function(handshakeData,callback){
    signedCookieParser(handshakeData,{},function(err){       //解析cookie字符串
        if(err){
            callback(err,false);                                //callback(err,boolean);boolean:为false时，表示拒绝建立连接，true：键列socket连接
        }else{
            sessionStore.get(handshakeData.signedCookies['connect.sid'],function(err,session){//通过cookie中保存到session的id获取服务端对象的 session
                if(err){
                    callback(err.message,false)
                }else{
                    handshakeData.session = session;
                    if(session){
                        if(session.userId){
                            callback(null,true)
                        }else{
                            callback("No login",false)
                        }
                    }else{
                        callback("No login",false)
                    }
                }
            })
        }
    })
});

//连接socket
io.sockets.on("connection",function(socket){
    var userId = socket.request.session.userId;
    console.log(userId);
    console.log("========l连接了");
    socketApi.connect(socket);                                 //socket连接
    socket.on("disconnect",function(){                       //关闭连接
        socketApi.disconnect(socket)
    });
    socket.on("technode",function(request){                  //在服务单定义的事件在客服端触发
        //console.log(request.action)
        socketApi[request.action](request.data,socket,io);
    })
});






