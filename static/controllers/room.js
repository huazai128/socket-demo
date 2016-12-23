angular.module("myApp")
    .controller("RoomCtrl",["$scope","$routeParams","server",function($scope,$routeParams,server){
        //��ǰ�û����룻��ȡ��ǰ�û���Ϣ��������roomID��
        server.joinRoom({
            user: $scope.me,             //��ȡ�û�
            room:{
                _id:$routeParams.roomId
            }
        });
        //����������ID��ȡ�����û���Ϣ�Ͷ�����Ϣ
        $scope.room = server.getRoom($routeParams.roomId);
        //����url�ı仯
        $scope.$on("$routeChangeStart",function(){
            server.leaveRoom({
                user:$scope.me,
                room:$scope.room
            })
        })
    }]);