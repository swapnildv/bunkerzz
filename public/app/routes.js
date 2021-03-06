var app = angular.module('appRoutes', ['ngRoute']).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/views/pages/users/login.html',
            authenticated: false
        })

            .when('/home', {
                templateUrl: 'app/views/pages/home.html',
                authenticated: true
            })
            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })
            .when('/users/:cafeid', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: false,
                activetab: 'cafe'
            })
            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })
            .when('/resetpassword', {
                templateUrl: 'app/views/pages/reset/password.html',
                controller: 'forgotpwdCtrl',
                controllerAs: 'forgotPwd',
                authenticated: false
            })
            .when('/reset/:token', {
                templateUrl: 'app/views/pages/reset/newpassword.html',
                controller: 'resetCtrl',
                controllerAs: 'reset',
                authenticated: false
            })
            .when('/cafe', {
                templateUrl: 'app/views/pages/management/cafe.html',
                controller: 'cafeCtrl',
                controllerAs: 'cafe',
                authenticated: true,
                permission: ['admin'],
                activetab: 'cafe'
            })
            .when('/menu/:cafeid', {
                templateUrl: 'app/views/pages/management/menu.html',
                controller: 'menuCtrl',
                controllerAs: 'menu',
                authenticated: true,
                permission: ['admin', 'moderator'],
                activetab: 'cafe'
            })
            .when('/order', {
                templateUrl: 'app/views/pages/transaction/order.html',
                controller: 'transactionCtrl',
                controllerAs: 'transaction',
                authenticated: false,
                activetab: 'order'
                
            })
            .when('/reports/transactions', {
                templateUrl: 'app/views/pages/transaction/report.html',
                controller: 'reportCtrl',
                controllerAs: 'report',
                authenticated: true,
                permission: ['admin', 'moderator'],
                activetab: 'report'
                
            })
            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html',
                authenticated: true
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

app.run(['$rootScope', 'Auth', '$location', 'User', function ($rootScope, Auth, $location, User) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        if (next.$$route.authenticated == true) {
            if (!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/home');
            } else if (next.$$route.permission) {
                User.getPermission().then(function (data) {

                    //check for valid permissions.  
                    if (next.$$route.permission[0] != data.data.permission) {
                        if (next.$$route.permission[1] != data.data.permission) {
                            event.preventDefault();
                            $location.path('/home');
                        }
                    }
                });
            }
        }
        // else if (next.$$route.authenticated == false) {
        //     if (Auth.isLoggedIn()) {
        //         event.preventDefault();
        //         $location.path('/home');
        //     }
        // }
    });
}]);
