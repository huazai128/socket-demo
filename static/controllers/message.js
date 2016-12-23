var myApp = angular.module("myApp");
myApp.controller("MessageCtrl",["$scope","server",function($scope,server){
    $scope.createMessage = function(){
        server.createMessage({
            content: $scope.newMessage,
            creator:$scope.me,
            roomId:$scope.room._id
        })
        $scope.newMessage = "";
    };
}])