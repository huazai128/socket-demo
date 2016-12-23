var myApp = angular.module("myApp");
myApp.factory("socket",["$rootScope",function($rootScope){
    var socket = io();                     //客服端连接socket.io
    return {
        on: function(eventName, callback) {    //定义一个on事件；接受两个参数，自定义事件名和回调函数，回调函数接收emit触发传递过来的数据
            socket.on(eventName, function() {
                var args = arguments;           //arguments:是被传递的数据
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                })
            })
        },
        emit: function(eventName, data, callback) {    //定义emit事件：接受三个参数，eventName：事件名，data，事件实处的的数据，callback：回调函数
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args)
                    }
                })
            })
        }
    }
}]);