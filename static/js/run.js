var myApp = angular.module("myApp",['ngRoute', 'angularMoment']);

myApp.run(["$window","$rootScope","$location","server",function($window,$rootScope,$location,server){
    $window.moment.locale("zh-cn");
    server.validate().then(function(){
        if($location.path() === "/login"){
            $location.path("/rooms");
        }
    },function(){
        $location.path("/login");
    });
    $rootScope.me = server.getUser();

    $rootScope.login = function(){
        server.logout().then(function(){
            $location.path("/login");
        })
    }
}]);