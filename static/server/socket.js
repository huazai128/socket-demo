var myApp = angular.module("myApp");
myApp.factory("socket",["$rootScope",function($rootScope){
    var socket = io();                     //�ͷ�������socket.io
    return {
        on: function(eventName, callback) {    //����һ��on�¼������������������Զ����¼����ͻص��������ص���������emit�������ݹ���������
            socket.on(eventName, function() {
                var args = arguments;           //arguments:�Ǳ����ݵ�����
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                })
            })
        },
        emit: function(eventName, data, callback) {    //����emit�¼�����������������eventName���¼�����data���¼�ʵ���ĵ����ݣ�callback���ص�����
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