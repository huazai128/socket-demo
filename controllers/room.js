var db = require("../models");
var async = require("async");

//��ȡ���еķ���
exports.getRooms = function(callback){
    db.Room.find({},function(err,rooms){
        if(err){
            res.json(500,{
                msg:err
            })
        }else{
            var roomsData = [];
            async.each(rooms,function(room,done){     //each:��ͬһ���������е�Ԫ�ض�ִ��ͬһ���첽����
                var roomData = room.toObject();
                async.parallel([
                    function(done){
                        db.User.find({roomId:roomData._id,online:true},function(err,users){   //���ݷ����ѯ�����ڵ�ǰ������û�
                            done(err,users)
                        })
                    },
                    function(done){
                        db.Message.find({roomId:roomData._id},function(err,messages){          //���ݷ����ѯ�Ի���Ϣ
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

//����roomId���������ң���ȡ���������е��û��ͶԻ���Ϣ
exports.getRoom = function(roomId,callback){
    db.Room.findOne({_id:roomId},function(err,room){
        if(err){
            callback(err);
        }else{
            async.parallel([
                function(done){
                    db.User.find({roomId:roomId},function(err,users){         //��ȡ��ǰ�������е��û�
                        done(err,users);
                    })
                },
                function(done){
                    db.Message.find({roomId:roomId},null,{$sort:{createAt:-1},limit:20},function(err,messages){  //��ȡ��ǰ�������е���Ϣ,����nullΪundefined��
                        done(err,messages.reverse());        //�������ڵߵ�������Ԫ�ص�˳��
                    })
                }
            ],function(err,results){
                if(err){
                    callback(err);
                }else{
                    room = room.toObject();
                    room.users = results[0];    //�ֶ���û�У��������������
                    room.messages = results[1];
                    callback(null,room);
                }
            })
        }
    })
};

//��������
exports.createRoom = function(room,callback){
    var r = db.Room();
    r.name = room.name;
    r.save(callback);
};