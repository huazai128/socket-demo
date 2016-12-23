var path = require("path");
var api = require("./api");

module.exports = function(app){
    //��֤�û��Ƿ��ѵ�¼
    app.get("/api/validate",api.validate);
    //��¼��
    app.post("/login",api.login);
    //�˳�
    app.get("/logout",api.logout);

    app.all("/*",function(req,res,next){
        res.sendFile(path.join(__dirname,"../static/index.html"));
    });
};