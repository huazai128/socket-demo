var Controller = require("../controllers");

//验证
exports.validate = function(req,res){
    var userId = req.session.userId;         //
    if(userId){
        Controller.user.findOneById({_id:userId},function(err,user){
            if(err){
                res.json(500,{
                    msg:err
                })
            }else{
                res.json(user)
            }
        })
    }else{
        res.status(401).json(null)
    }
};

//登录
exports.login = function(req,res){
    var email = req.body.email;
    if(email){
        Controller.user.findByEmailOrCreate(email,function(err,user){
            if(err){
                res.json(500,{
                    msg:err
                })
            }else{
                req.session.userId = user._id;   //设置session
                Controller.user.online(user,function(err,user){
                    if(err){
                        res.json(500,{
                            msg:err
                        })
                    }else{
                        res.json(user);
                    }
                })
            }
        })
    }else{
        res.json(403,{
            msg:"请输入您的email"
        })
    }
};

//退出
exports.logout =function(req,res){
    var userId = req.session.userId;
    Controller.user.offOnline(userId,function(err,user){
        if(err){
            res.json(500,{
                msg:err
            })
        }else{
            req.session.destroy(function(){  //
                console.log("删除了")
            });
            res.json(200)
        }
    })
};

