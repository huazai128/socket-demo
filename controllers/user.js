var db = require("../models");
var async = require("async");
var gravatar = require("gravatar");

//登录或者创建
exports.findByEmailOrCreate = function(email,callback){
    db.User.findOne({email:email},function(err,user){
        if(user){
            callback(null,user)
        }else{
            user = new db.User();
            user.email = email;
            user.name = email.split("@")[0];  //split���и������һ������
            user.avatarUrl = gravatar.url(email);
            user.save(callback)
        }
    })
};

//在线
exports.online = function(userId,callback){
    db.User.findOneAndUpdate({_id:userId},{$set:{online:true}},{new :true},callback)
};

//根据用户ID查找
exports.findOneById =  function(userId,callback){
    db.User.findOne({_id:userId},callback);
};

//获取所有在线用户
exports.getOnlineUsers = function(callback){
    db.User.find({online:true},callback);
};

//下线
exports.offOnline = function(userId,callback){
    db.User.findOneAndUpdate({_id:userId},{$set:{online:false}},{new:true},callback)
};

//离开聊天室
exports.leaveRoom = function(user,callback){
    db.User.findOneAndUpdate({_id:user._id},{$set:{online:true,roomId:null}},{new:true},callback);
};

//加入聊天室;包含用户信息和聊天室信息
exports.joinRoom = function(join,callback){
    db.User.findOneAndUpdate({_id:join.user._id},{$set:{online:true,roomId:join.room._id}},{new:true},callback)
};

