var Controller = require("../controllers");

//������֤session�ػ�
exports.validate = function(req,res){
    var userId = req.session.userId;         //��ȡsession
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

//��¼
exports.login = function(req,res){
    var email = req.body.email;
    if(email){
        Controller.user.findByEmailOrCreate(email,function(err,user){
            if(err){
                res.json(500,{
                    msg:err
                })
            }else{
                req.session.userId = user._id;   //�洢session
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
            msg:"������email"
        })
    }
};

//�˳���¼
exports.logout =function(req,res){
    var userId = req.session.userId;
    Controller.user.offOnline(userId,function(err,user){
        if(err){
            res.json(500,{
                msg:err
            })
        }else{
            req.session.destroy(function(){  //ɾ��session
                console.log("ɾ��")
            });
            res.json(200)
        }
    })
};

exports.getUsers = function(req,res){
    Controller.user.getOnlineUsers(function(err,users){

    })
}


