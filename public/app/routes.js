var app = angular.module('appRoutes', ['ngRoute']).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/views/pages/home.html'
        })
            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })
            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: false
            })
            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })
            .when('/cafe', {
                templateUrl: 'app/views/pages/cafe.html',
                authenticated: true
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
            .when('/management', {
                templateUrl: 'app/views/pages/management/management.html',
                controller: 'managementCtrl',
                controllerAs: 'management',
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

app.run(['$rootScope', 'Auth', '$location', function ($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        if (next.$$route.authenticated == true) {
            if (!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }
            //console.log('Needs to be authenticated');
        } else if (next.$$route.authenticated == false) {
            if (Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }
            //console.log('Need not to be authenticated');
        }
    });
}]);
