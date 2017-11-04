angular.module('bunkerzz',
    ['appRoutes',
        'userController',
        'userServices',
        'ngAnimate',
        'mainController',
        'authService',
        'managementController',
        'cafeServices',
        'cafeController'
    ])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    })
