angular.module("myApp")
    .controller("LoginCtrl",["$scope","$location","server",function($scope,$location,server){
        $scope.login = function(){
            var email = $scope.email;
            //then()；接受两个函数，Promise对象
            server.login(email).then(function(){
                $location.path("/rooms");
            },function(){
                $location.path("/login");
            })
        }
    }]);