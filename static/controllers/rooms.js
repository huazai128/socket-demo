angular.module("myApp")
    .controller("RoomsCtrl",["$scope","$location","server",function($scope,$location,server){
        //��ȡ��ȡ���еķ���
        $scope.filteredRooms  = $scope.rooms = server.getRooms();
        //����room
        $scope.searchRoom = function(){
            if($scope.searchKey){//��ĸ��Сд
                $scope.filteredRooms = $scope.rooms.filter(function(room){
                    return room.name.indexOf($scope.searchKey) > -1;
                })
            }else{
                $scope.filteredRooms = $scope.rooms;
            }
        };
        //����������
        $scope.createRoom = function(){
            if($scope.searchKey){
                console.log($scope.searchKey);
                server.createRoom({name:$scope.searchKey});
            }
        };
        //���뷿��
        $scope.enterRoom = function(room){
            $location.path("/rooms/"+ room._id);
        };
        //���ڼ���Collection�仯
        $scope.$watchCollection("rooms",function(){
            $scope.rooms = server.getRooms();
        });
    }]);