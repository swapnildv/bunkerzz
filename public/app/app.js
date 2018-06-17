angular.module('bunkerzz',
    ['angularUtils.directives.dirPagination',
        'exportToExcel',
        'appRoutes',
        'userController',
        'userServices',
        'ngAnimate',
        'mainController',
        'authService',
        'managementController',
        'managementServices',
        'transactionController',
        'transactionServices'
    ])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    })
