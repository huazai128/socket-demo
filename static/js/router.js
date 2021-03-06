/**
 * ·������
 * @type {*|{exports}|angular.Module}
 */
var myApp = angular.module("myApp");
myApp.config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/rooms",{
            templateUrl:"template/rooms.html",
            controller:"RoomsCtrl"
        })
        .when("/rooms/:roomId",{
            templateUrl:"template/room.html",
            controller:"RoomCtrl"
        })
        .when("/login",{
            templateUrl:"template/login.html",
            controller:"LoginCtrl"
        })
        .otherwise({
            redirectTo:"/login"
        })
}])