var Controller = require("../controllers");

//用于验证session回话
exports.validate = function(req,res){
    var userId = req.session.userId;         //获取session
    if(userId){
        Controller.user.findOneById({_id:userId},function(err,user){
            if(err){
                res.json(500,{
                    msg:err
                })
            }else{
                console.log(user);
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
                req.session.userId = user._id;   //存储session
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
            msg:"请输入email"
        })
    }
};

//退出登录
exports.logout =function(req,res){
    var userId = req.session.userId;
    Controller.user.offOnline(userId,function(err,user){
        if(err){
            res.json(500,{
                msg:err
            })
        }else{
            req.session.destroy(function(){  //删除session
                console.log("删了")
            });
            res.json(200)
        }
    })
};

exports.getUsers = function(req,res){
    Controller.user.getOnlineUsers(function(err,users){

    })
}


