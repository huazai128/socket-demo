var db = require("../models");
var async = require("async");
var gravatar = require("gravatar");

//�������¼
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

//��¼����
exports.online = function(user,callback){
    db.User.findOneAndUpdate({_id:user._id},{$set:{online:true}},{new :true},callback)
};

//����ID��ѯ
exports.findOneById =  function(userId,callback){
    db.User.findOne({_id:userId},callback);
};

//��ȡ���е��û�
exports.getOnlineUsers = function(callback){
    db.User.find({online:true},callback);
};

//�˳���¼
exports.offOnline = function(userId,callback){
    db.User.findOneAndUpdate({_id:userId},{$set:{online:false}},{new:true},callback)
}