angular.module('bunkerzz',
    ['appRoutes',
        'userController',
        'userServices',
        'ngAnimate',
        'mainController',
        'authService',
        'managementController',
        'managementServices'
    ])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    })
