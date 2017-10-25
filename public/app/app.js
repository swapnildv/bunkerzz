angular.module('bunkerzz', ['appRoutes', 'userController', 'userServices', 'ngAnimate', 'mainController', 'authService'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
})
