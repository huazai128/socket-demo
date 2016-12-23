var Controllers = require("../controllers");
var ObjectId = require("mongoose").Schema.ObjectId;
var config = require("../config/config");

//服务端连接登录
exports.connect = function(socket){
    var userId = socket.request.session.userId;
    //console.log(userId);
    if(userId){
        Controllers.user.online(userId,function(err,user){
            if(err){
                //在客服端创建err事件在服务端进行监听；emit触发病床地数据；
                socket.emit("err",{
                    mesg:err
                })
            }else{
                if(user.roomId){                         //判断用户是否已经加入房间

                    socket.join(user.roomId);            //socket.join():用于实现多个聊天室进行聊天，socket.join()添加进去就可以了；
                    socket["in"](user.roomId).broadcast.emit("technode",{     //点击进入聊天室；
                        action:"joinRoom",
                        data:{
                            user:user
                        }
                    });
                    socket.emit("technode",{           //进入
                        action:"joinRoom",
                        data:{
                            user:user
                        }
                    });
                    socket["in"](user.roomId).broadcast.emit("technode",{    //进入后广播一天系统信息
                        action:"createMessage",
                        data:{
                            content:user.name + " 进入聊天室",
                            creator:config.robot,
                            createAt:new Date(),
                            roomId:user.roomId,
                            _id:ObjectId()
                        }
                    })
                }
            }
        })
    }
};

//关闭连接
exports.disconnect = function(socket){
    var userId = socket.request.session.userId;
    if(userId){
        Controllers.user.offOnline(userId,function(err,user){   //用户下线
            if(err){
                socket.emit("err",{
                    mesg:err
                })
            }else{
                if(user.roomId){
                    socket["in"](user.roomId).broadcast.emit("technode",{
                        action:"leaveRoom",       //触发离开聊天室时，传递用户信息和房间号
                        data:{
                            user:user,
                            room:{
                                _id:user.roomId
                            }
                        }
                    });
                    socket["in"](user.roomId).broadcast.emit("technode",{
                        action:"createMessage",   //离开后给当前的房间广播一天系统信息
                        data:{
                            content:user.name + " 已经离开聊天室",
                            creator:config.robot,
                            createAt:new Date(),
                            roomId:user.roomId,
                            _id:ObjectId()
                        }
                    });
                    Controllers.user.leaveRoom(user,function(){});  //离开后更改当前用户roomId信息
                }
            }
        })
    }
};

//获取房间
exports.getRooms = function(data,socket){
    if(data && data.roomId){
        Controllers.rooms.getRoom(data.roomId,function(err,room){   //根据房间ID进入聊天室，获取聊天室所有用户和对话信息
            if(err){
                socket.emit("err",{
                    mesg:err
                })
            }else{
                socket.emit("technode",{
                    action:"getRooms",         //房间号
                    roomId:data.roomId,         //
                    data:room
                })
            }
        })
    }else{
        Controllers.rooms.getRooms(function(err,rooms){  //获取所有的房间
           // console.log(rooms);
            if(err){
                socket.emit("err",{            //客服端定义的事件，在服务端触发
                    mesg:err
                })
            }else{
                socket.emit("technode",{
                    action:"getRooms",       //获取所以得房间
                    data:rooms
                })
            }
        })
    }
};
//创建聊天室
exports.createRoom = function(room,socket,io){
    Controllers.rooms.createRoom(room,function(err,item){
        if(err){
            socket.emit("err",{
                mesg:err
            })
        }else{
            item = item.toObject();    //强制转换成对象
            item.users = [];           //新建的聊天室没有用户
            io.sockets.emit("technode",{
                action:"createRoom",
                data:item
            })
        }
    })
};

//进入聊天室；包含了用户信息和聊天室信息
exports.joinRoom = function(join,socket){
    Controllers.user.joinRoom(join,function(err,user){
        if(err){
            socket.emit("emit",{
                mesg:err
            })
        }else{
            join.user = user;   //获取当前获取进入聊天室后的信息
            socket.join(join.user.roomId);  //join()；添加聊天室的房间可以进行多个聊天室聊天
            socket.emit("technode",{
                action:"joinRoom",
                data:join
            });
            socket["in"](user.roomId).broadcast.emit("technode",{  //向聊天室
                action:"createMessage",
                data:{
                    content:user.name + "进入了聊天室",
                    creator:config.robot,
                    createAt:new Date(),
                    roomId:user.roomId,
                    _id:ObjectId()
                }
            });
            socket["in"](user.roomId).broadcast.emit("technode",{  //聊天室广播事件
                action:"joinRoom",
                data:join
            });
        }
    })
};

//离开聊天室
exports.leaveRoom = function(leave,socket){
    Controllers.user.leaveRoom(leave.user,function(err,user){
        if("err"){
            socket.emit("err",{
                mesg:err
            })
        }else{
            socket["in"](leave.room._id).broadcast.emit("technode",{   //离开就想聊天室广播一条系统信息
                action:"createMessage",
                data:{
                    content:leave.user.name + "离开了聊天室",
                    creator:config.robot,
                    createAt: new Date(),
                    roomId: leave.room._id,
                    _id:ObjectId()
                }
            });
            socket["in"](leave.room._id).broadcast.emit("technode",{
                action:"leaveRoom",
                data:leave
            });
            socket.emit("technode",{
                action:"technode",
                data:leave
            });
            socket.leave(leave.room._id);     //离开当前的聊天室
            console.log("离开了房间");
        }
    })
};



exports.createMessage = function(message,socket){
    Controllers.message.create(message,function(err,message){
        if(err){
            socket.emit("err",{
                mesg:err
            })
        }else{
            socket["in"](message.roomId).broadcast.emit("technode",{
                action:"createMessage",
                data:message
            });
            socket.emit("technode",{
                action:"createMessage",
                data:message
            })
        }
    })
}