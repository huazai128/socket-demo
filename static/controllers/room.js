angular.module("myApp")
    .controller("RoomCtrl",["$scope","$routeParams","server",function($scope,$routeParams,server){
        //当前用户加入；获取当前用户信息；并更改roomID；
        server.joinRoom({
            user: $scope.me,             //获取用户
            room:{
                _id:$routeParams.roomId
            }
        });
        //根据聊天室ID获取所有用户信息和对象信息
        $scope.room = server.getRoom($routeParams.roomId);
        //监听url的变化
        $scope.$on("$routeChangeStart",function(){
            server.leaveRoom({
                user:$scope.me,
                room:$scope.room
            })
        })
    }]);