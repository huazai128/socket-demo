var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
var path = require("path");
var MongoStore = require("connect-mongo")(session);
var signedCookieParser = cookieParser("FSFC-SVFV-VEVS");


var app = express();

//�����ļ�
var config =  require("./config/config");

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

app.listen(port,function(){
    console.log("Listening :" + port);
});







