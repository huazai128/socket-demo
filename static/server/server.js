var myApp = angular.module("myApp");
/**
 * $q服务是angular中封装实现的Promise对象，$q常见的方法；其实就是服务请求转换成Promise对象；通过then()方法获取值；这种异步方法
 * defer()：是一个延迟接口；创建一个deferred对象，这个对象可以执行几个常用的方法，比如resolve,reject,notify等
 * all() 传入Promise的数组，批量执行，返回一个promise对象
 * when() 传入一个不确定的参数，如果符合Promise标准，就返回一个promise对象。
 *
 */

//自定义工厂服务；那所有的请求服务放在里面
myApp.factory("server",["$cacheFactory","$q","$http","socket",function($cacheFactory,$q,$http,socket){

    var cache = window.cache = $cacheFactory('technode');    //用于生成一个用来存储缓存对象的服务，并且提供对对象的访问。通过get来获取缓存。这样可以在不同controller中进行数据交换
    socket.on("technode",function(data){
        switch (data.action){
            case "getRooms":
                if(data.roomId){         //根据ID获取聊天室
                    angular.extend(cache.get(data.roomId),data.data)
                }else{
                    data.data.forEach(function(room){   //获取所有的聊天室
                        cache.get("rooms").push(room);   //是一个数组对象
                    });
                }
                break;
            case "leaveRoom" :            //离开聊天室;要操作两步，第一步在聊天室中删除删除当前用户信息
                var leave = data.data;
                var userId = leave.user._id;
                var roomId = leave.room._id;
                cache.get(roomId).users = cache.get(roomId).users.filter(function(user){  //在当前聊天室删除用户信息
                    return user._id != userId;
                });
                cache.get("rooms") && cache.get("rooms").forEach(function(room){        //遍历所有聊天室删除信息,查找用户所在的聊天室并删除用户信息
                    if(room._id === roomId){
                        room.users = room.users.filter(function(user){
                            return user._id != userId;
                        })
                    }
                });
                break;
            case "createRoom":        //创建聊天室；
                cache.get("rooms").push(data.data);
                break;
            case "joinRoom" :         //进入聊天室;需要房间ID和用户ID
                var join = data.data;
                var userId = join.user._id;
                var roomId = join.user.roomId;
                if(!cache.get(roomId)){ //判断是否缓存roomId，如果没有创建缓存
                    cache.get("rooms").forEach(function(room){
                        if(room._id === roomId){
                            cache.put(roomId,room);     //存储聊天室信息
                        }
                    })
                }
                cache.get(roomId).users.push(join.user);//在聊天室中添加用户信息
                break;
            case "createMessage":
                var message = data.data;
                cache.get(message.roomId).messages.push(message); //向聊天室添加对话信息
                break;
        }
    });
    socket.on("err",function(data){
        console.log(data);
    });
    return {
        //验证用户是否登录
        validate:function(){
            var deferred = $q.defer();                       //可以创建一个deferred实例;返回promise对象；可以调用resolve()和reject()方法
            $http({url:"/api/validate",method:"GET"})
                .success(function(user){
                    angular.extend(this.getUser(),user);   //和jQuery中extends一样；用于继承和覆盖之前的属性和方法；
                    deferred.resolve();
                }.bind(this))
                .error(function(data){
                    //console.log("你还没登录呢...");
                    deferred.reject();
                });
            return deferred.promise;                       //返回promise对象
        },
        //登录
        login: function(email) {
            var deferred = $q.defer();
            $http({url: '/login', method: 'POST', data: {email: email}})
                .success(function(user) {
                    angular.extend(cache.get('user'), user);
                    deferred.resolve()
                })
                .error(function() {
                    deferred.reject()
                });
            return deferred.promise
        },
        //退出登录
        logout:function(){
            var deferred = $q.defer();
            $http({url:"logout",method:"GET"})
                .success(function(){
                    var user = cache.get("user");
                    for(key in user){
                        if(user.hasOwnProperty(key)){
                            delete user[key];
                        }
                    }
                    cache.removeAll();     //删除缓存对象中所有的键值对。
                    deferred.resolve();   //在缓存对象中通过指定key获取对应的值。resolve():表示成功
                });
            return deferred.promise;
        },
        //缓存用户信息
        getUser:function(){
            if(!cache.get("user")){
                cache.put("user",{});     //在缓存对象中插入一个键值对(key,value)。
            }
            return cache.get("user");
        },
        //进入聊天室
        getRoom:function(roomId){
            if(!cache.get(roomId)){
                cache.put(roomId,{      //添加一个roomId的缓存
                    users:[],
                    messages:[]
                });
                socket.emit("technode",{   //触发服务端事件
                    action:"getRooms",    //如果存在roomID，就进入聊天室否则获取所有的聊天室
                    data:{
                        roomId:roomId
                    }
                })
            }
            return cache.get(roomId)
        },
        //获取所有房间，房间的信息随时都在发生变化，所以用socket
        getRooms:function(){
            if(!cache.get("rooms")){
                cache.put("rooms",[]);
                socket.emit('technode', {
                    action: 'getRooms'
                })
            }
            return cache.get("rooms");
        },
        //加入聊天室；
        joinRoom:function(join){
            socket.emit("technode",{
                action:"joinRoom",
                data:join
            })
        },
        //离开聊天室
        leaveRoom:function(leave){
            socket.emit("technode",{
                action:"leaveRoom",
                data:leave
            })
        },
        //创建房间
        createRoom:function(room){
            socket.emit("technode",{
                action:"createRoom",
                data:room
            })
        },
        //对话信息
        createMessage:function(message){
            socket.emit("technode",{
                action:"createMessage",
                data:message
            })
        }
    }
}]);