var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
var path = require("path");
var MongoStore = require("connect-mongo")(session);
var signedCookieParser = cookieParser("VDSDN-VSVDVN-VDVD");


var app = express();

//�����ļ�
var config =  require("./config/config");
var socketApi = require("./router/socketApi");

var port = process.env.PORT || 3000;

//session store
var sessionStore = new MongoStore({
    url:"mongodb://localhost/store"
});

//�м��
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

//��̬�ļ�
app.use(express.static(path.join(__dirname,"static")));

require("./router")(app);

var server = app.listen(port,function(){
    console.log("Listening :" + port);
});

//socket�ķ��������
var io = require("socket.io").listen(server);

//���ڹ���session������������֤���
io.set("authorization",function(handshakeData,callback){
    signedCookieParser(handshakeData,{},function(err){       //����cookie�ַ���
        if(err){
            callback(err,false);                                //callback(err,boolean);boolean:Ϊfalseʱ����ʾ�ܾ��������ӣ�true������socket����
        }else{
            sessionStore.get(handshakeData.signedCookies['connect.sid'],function(err,session){//ͨ��cookie�б��浽session��id��ȡ����˶���� session
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

//����socket
io.sockets.on("connection",function(socket){
    var userId = socket.request.session.userId;
    console.log(userId);
    console.log("========l������");
    socketApi.connect(socket);                                 //socket����
    socket.on("disconnect",function(){                       //�ر�����
        socketApi.disconnect(socket)
    });
    socket.on("technode",function(request){                  //�ڷ��񵥶�����¼��ڿͷ��˴���
        //console.log(request.action)
        socketApi[request.action](request.data,socket,io);
    })
});






