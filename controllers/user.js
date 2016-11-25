var db = require("../models");
var async = require("async");
var gravatar = require("gravatar");

//创建或登录
exports.findByEmailOrCreate = function(email,callback){
    db.User.findOne({email:email},function(err,user){
        if(user){
            callback(null,user)
        }else{
            user = new db.User();
            user.email = email;
            user.name = email.split("@")[0];  //split：切割，返回是一个数组
            user.avatarUrl = gravatar.url(email);
            user.save(callback)
        }
    })
};

//登录在线
exports.online = function(user,callback){
    db.User.findOneAndUpdate({_id:user._id},{$set:{online:true}},{new :true},callback)
};

//根据ID查询
exports.findOneById =  function(userId,callback){
    db.User.findOne({_id:userId},callback);
};

//获取所有的用户
exports.getOnlineUsers = function(callback){
    db.User.find({online:true},callback);
};

//退出登录
exports.offOnline = function(userId,callback){
    db.User.findOneAndUpdate({_id:userId},{$set:{online:false}},{new:true},callback)
}