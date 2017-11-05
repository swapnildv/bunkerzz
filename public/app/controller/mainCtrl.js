angular.module('mainController', ['authService'])
    .controller("mainCtrl", function (Auth, $timeout, $location, $rootScope,User) {
        var app = this;

        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isLoggedIn()) {

                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    console.log(data.data.username);
                    app.username = data.data.username;
                    User.getPermission().then(function(data){
                        if(data.data.permission === 'admin' ||  data.data.permission ==='moderator'){
                            app.authorised = true;
                        }
                        else{
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

                        $timeout(function () {

                            $location.path('/home');
                            app.loginData = {};
                            app.succMsg = '';
                        }, 2000);

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
            }, 2000)
        }
    });