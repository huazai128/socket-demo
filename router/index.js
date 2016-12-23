var path = require("path");
var api = require("./api");

module.exports = function(app){
    //验证用户是否已登录
    app.get("/api/validate",api.validate);
    //登录；
    app.post("/login",api.login);
    //退出
    app.get("/logout",api.logout);

    app.all("/*",function(req,res,next){
        res.sendFile(path.join(__dirname,"../static/index.html"));
    });
};