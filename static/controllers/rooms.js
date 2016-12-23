angular.module("myApp")
    .controller("RoomsCtrl",["$scope","$location","server",function($scope,$location,server){
        //获取获取所有的房间
        $scope.filteredRooms  = $scope.rooms = server.getRooms();
        //搜索room
        $scope.searchRoom = function(){
            if($scope.searchKey){//字母大小写
                $scope.filteredRooms = $scope.rooms.filter(function(room){
                    return room.name.indexOf($scope.searchKey) > -1;
                })
            }else{
                $scope.filteredRooms = $scope.rooms;
            }
        };
        //创建聊天室
        $scope.createRoom = function(){
            if($scope.searchKey){
                console.log($scope.searchKey);
                server.createRoom({name:$scope.searchKey});
            }
        };
        //进入房间
        $scope.enterRoom = function(room){
            $location.path("/rooms/"+ room._id);
        };
        //用于监听Collection变化
        $scope.$watchCollection("rooms",function(){
            $scope.rooms = server.getRooms();
        });
    }]);