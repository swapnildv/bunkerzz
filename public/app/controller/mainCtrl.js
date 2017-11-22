angular.module('mainController', ['authService'])
    .controller("mainCtrl", function (Auth, $timeout, $location, $rootScope, User, $scope, $route) {
        var app = this;
        $scope.$route = $route;
        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isLoggedIn()) {

                app.isLoggedIn = true;

                Auth.getUser().then(function (data) {

                    //  console.log(data.data.username);
                    app.username = data.data.user.username;
                    //console.log(data.data.user.cafeId);
                    $rootScope.loggedInUser = data.data.user;
                    User.getPermission().then(function (data) {
                        console.log(data)

                        app.role = data.data.permission;
                        if (data.data.permission === 'admin') {
                            app.authorised = true;
                        }
                        else {
                            app.authorised = false;
                        }
                    })
                })
            }
            else {
                app.isLoggedIn = false;
                app.username = '';
            }
        });

        this.doLogin = function (loginData) {
            app.loading = true;
            app.errMsg = false;
            app.succMsg = false;



            Auth.login(app.loginData)
                .then(function (data) {
                    app.loading = false;
                    if (data.data.success) {
                        app.succMsg = data.data.message + "...Redirecting";
                        var locationPath = '';
                        if (data.data.user) {
                            if (data.data.user.permission == 'admin') {
                                locationPath = '/cafe';
                            } else {
                                locationPath = '/order';
                            }
                        }
                        else
                            locationPath = '/order';
                        $timeout(function () {
                            $location.path(locationPath);
                            app.loginData = {};
                            app.succMsg = '';
                        }, 1000);

                    }
                    else {
                        //Create error message
                        app.errMsg = data.data.message;
                    }
                });
        }

        this.logout = function () {
            Auth.logout();
            $location.path('/logout');
            $timeout(function () {
                $location.path('/');
            }, 100);
        }
    });