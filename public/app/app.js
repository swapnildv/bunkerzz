angular.module('bunkerzz', ['appRoutes', 'userController', 'userServices', 'ngAnimate', 'mainController', 'authService','managementController'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
})
