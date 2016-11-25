var myApp = angular.module("myApp");
/**
 * $q服务是angular中封装实现的Promise对象，$q常见的方法；其实就是服务请求转换成Promise对象；通过then()方法获取值；这种异步方法
 * defer()：是一个延迟接口；创建一个deferred对象，这个对象可以执行几个常用的方法，比如resolve,reject,notify等
 * all() 传入Promise的数组，批量执行，返回一个promise对象
 * when() 传入一个不确定的参数，如果符合Promise标准，就返回一个promise对象。
 *
 */

//自定义工厂服务；那所有的请求服务放在里面
myApp.factory("server",["$cacheFactory","$q","$http",function($cacheFactory,$q,$http){
    var cache = window.cache = $cacheFactory('technode');    //用于生成一个用来存储缓存对象的服务，并且提供对对象的访问。通过get来获取缓存。这样可以在不同controller中进行数据交换
    return {
        //验证用户是否登录
        validate:function(){
            var deferred = $q.defer();                       //可以创建一个deferred实例;返回promise对象；可以调用resolve()和reject()方法
            console.log(deferred);
            $http({url:"/api/validate",method:"GET"})
                .success(function(user){
                    console.log(this.getUser());
                    angular.extend(this.getUser(),user);   //和jQuery中extends一样；用于集成和覆盖之前的属性和方法；
                    deferred.resolve();
                    console.log(user)
                }.bind(this))
                .error(function(data){
                    console.log("你还没登录呢...");
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
                    cache.removeAll();     //删除缓存对象中所有的键值对。
                    console.log(cache.get("user"));
                    deferred.resolve();   //在缓存对象中通过指定key获取对应的值。
                });
            return deferred.promise;
        },
        getUser:function(){
            if(!cache.get("user")){
                cache.put("user",{});     //在缓存对象中插入一个键值对(key,value)。
            }
            return cache.get("user");
        }
    }
}])