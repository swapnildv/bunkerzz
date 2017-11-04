var app = angular.module('appRoutes', ['ngRoute']).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
<<<<<<< HEAD
            templateUrl: 'app/views/pages/users/login.html',
            authenticated: false
        })
=======
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })
>>>>>>> 7c9d157db847ed2035e6e0f3897347fff2188529
            .when('/home', {
                templateUrl: 'app/views/pages/home.html',
                authenticated: true
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
<<<<<<< HEAD

=======
            .when('/cafe', {
                templateUrl: 'app/views/pages/cafe.html',
                controller: 'cafeCtrl',
                controllerAs: 'cafe',
                authenticated: true
            })
>>>>>>> 7c9d157db847ed2035e6e0f3897347fff2188529
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
                authenticated: true,
                permission: ['admin', 'moderator']
            })
<<<<<<< HEAD
            .when('/cafe', {
                templateUrl: 'app/views/pages/cafe.html',
                controller: 'cafeCtrl',
                controllerAs: 'cafe',
                authenticated: true,
                permission: ['admin']
            })
=======
>>>>>>> 7c9d157db847ed2035e6e0f3897347fff2188529
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
                $location.path('/');
            } else if (next.$$route.permission) {
                User.getPermission().then(function (data) {
                    //check for valid permissions.  
                    if (next.$$route.permission[0] != data.data.permission) {
                        if (next.$$route.permission[1] != data.data.permission) {
                            event.preventDefault();
                            $location.path('/');
                        }
                    }
                });
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
