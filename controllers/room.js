var db = require("../models");
var async = require("async");

//获取所有的房间
exports.getRooms = function(callback){
    db.Room.find({},function(err,rooms){
        if(err){
            res.json(500,{
                msg:err
            })
        }else{
            var roomsData = [];
            async.each(rooms,function(room,done){     //each:对同一集合中所有的元素都执行同一个异步操作
                var roomData = room.toObject();
                async.parallel([
                    function(done){
                        db.User.find({roomId:roomData._id,online:true},function(err,users){   //根据房间查询所有在当前房间的用户
                            done(err,users)
                        })
                    },
                    function(done){
                        db.Message.find({roomId:roomData._id},function(err,messages){          //根据房间查询对话信息
                            done(err,messages)
                        })
                    }
                ],function(err,results){
                    if(err){
                        done(err)
                    }else{
                        roomData.users = results[0];
                        roomData.messages  = results[1];
                        roomsData.push(roomData);
                        done();
                    }
                })
            },function(err){
                callback(err,roomsData)
            })
        }
    })
};

//根据roomId进入聊天室；获取聊天室所有的用户和对话信息
exports.getRoom = function(roomId,callback){
    db.Room.findOne({_id:roomId},function(err,room){
        if(err){
            callback(err);
        }else{
            async.parallel([
                function(done){
                    db.User.find({roomId:roomId},function(err,users){         //获取当前房间所有的用户
                        done(err,users);
                    })
                },
                function(done){
                    db.Message.find({roomId:roomId},null,{$sort:{createAt:-1},limit:20},function(err,messages){  //获取当前房间所有的信息,不加null为undefined；
                        done(err,messages.reverse());        //方法用于颠倒数组中元素的顺序。
                    })
                }
            ],function(err,results){
                if(err){
                    callback(err);
                }else{
                    room = room.toObject();
                    room.users = results[0];    //字段中没有，在这里添加属性
                    room.messages = results[1];
                    callback(null,room);
                }
            })
        }
    })
};

//创建房间
exports.createRoom = function(room,callback){
    var r = db.Room();
    r.name = room.name;
    r.save(callback);
};