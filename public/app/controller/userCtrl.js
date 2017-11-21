angular.module('userController', ['userServices'])
    .controller('regCtrl', function ($http, $location, $timeout, User, $routeParams,$scope) {

        var app = this;
        this.showCreateForm = false;
        app.roles = ['user', 'moderator'];
        //get cafe wise users.
        app.getUsersByCafeId = function () {
            if ($routeParams.cafeid) {
                app.loading = true;
                app.errMsg = false;
                app.succMsg = false;
                User.getUsersByCafe($routeParams.cafeid).then(function (data) {
                    if (data.data.success) {
                        app.loading = false;
                        app.users = data.data.users;
                    } else {
                        app.loading = false;
                        app.errMsg = data.data.message;
                    }
                });
            }
        }

        app.getUsersByCafeId();

        this.regUser = function (regData, valid) {

            app.loading = true;
            app.errMsg = false;
            app.succMsg = false;
            //set cafeid.
            if ($routeParams.cafeid) {
                app.regData.cafeid = $routeParams.cafeid;
            }
            console.log(app.regData);
            if (valid) {
                User.create(app.regData)
                    .then(function (data) {
                        debugger;
                        app.loading = false;
                        if (data.data.success) {
                            debugger;
                            app.succMsg = data.data.message;

                            app.regData = {};
                            $scope.regForm.$setPristine();
                            $scope.confirm = '';
                            $scope.firstpassword = '';
                            app.getUsersByCafeId();
                            app.showCreateForm = false;
                            // $timeout(function () {
                            //     $location.path('/');
                            // }, 2000);

                        }
                        else {
                            //Create error message
                            app.errMsg = data.data.message;
                        }
                    });
            } else {
                app.loading = false;
                app.errMsg = "Please ensure form is filled properly";
            }
        }

        app.createUserButton = function () {
            this.showCreateForm = true;
        }

        app.cancelCreate = function () {
            this.showCreateForm = false;
        }



        this.checkUsername = function (regData) {


            app.checkingUsername = true;
            app.usernameMsg = false;
            app.usernameInvalid = false;
            User.checkUsername(app.regData).then(function (data) {
                if (data.data.success) {
                    app.checkingUsername = false;
                    app.usernameInvalid = false;
                    app.usernameMsg = data.data.message;
                }
                else {
                    app.checkingUsername = false;
                    app.usernameInvalid = true;
                    app.usernameMsg = data.data.message;
                }
            });
        }

        this.checkEmail = function (regData) {

            app.checkingEmail = true;
            app.emailMsg = false;
            app.emailInvalid = false;
            User.checkEmail(app.regData).then(function (data) {
                if (data.data.success) {
                    app.checkingEmail = false;
                    app.emailInvalid = false;
                    app.emailMsg = data.data.message;
                }
                else {
                    app.checkingEmail = false;
                    app.emailInvalid = true;
                    app.emailMsg = data.data.message;
                }
            });
        }


    })

    .directive('match', function () {
        return {
            restrict: 'A',
            controller: function ($scope) {

                $scope.confirmed = false;
                $scope.doConfirm = function (values) {
                    // console.log(values);
                    // console.log($scope.confirm);

                    values.forEach(function (element) {
                        if ($scope.confirm == element) {
                            $scope.confirmed = true;
                        } else {
                            $scope.confirmed = false;
                        }
                    });
                }
            },
            link: function (scope, element, attrs) {
                attrs.$observe('match', function () {
                    //console.log(attrs.match);
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });

                scope.$watch('confirm', function () {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
            }

        };
    })
    .controller('forgotpwdCtrl', function (User) {

        var app = this;
        app.resetpassword = function (userData, valid) {
            app.errMsg = false;
            app.succMsg = false;
            app.loading = true;
            if (valid) {
                User.sendPassword(app.userData).then(function (data) {
                    app.loading = false;
                    if (data.data.success) {
                        app.succMsg = data.data.message;
                    } else {
                        app.errMsg = data.data.message;
                    }
                });
            } else {
                app.loading = false;
                app.errMsg = "Please enter valid e-mail."
            }
        }
    })
    .controller('resetCtrl', function (User, $routeParams, $scope, $timeout, $location) {

        var app = this;
        app.hide = true;
        User.resetPassword($routeParams.token).then(function (data) {
            if (data.data.success) {
                app.hide = false;
                app.succMsg = "Please enter a new password";
                $scope.username = data.data.user.username;
                console.log($scope.username);
            } else {
                app.hide = true;
                app.errMsg = data.data.message;
            }
        });

        app.savePassword = function (regData, valid, confirmed) {
            app.errMsg = false;
            app.succMsg = false;
            app.disabled = true;
            app.loading = true;

            if (valid && confirmed) {
                app.regData.username = $scope.username;
                app.disabled = false;
                User.savePassword(app.regData).then(function (data) {
                    console.log(data);
                    app.loading = false;
                    if (data.data.success) {
                        app.succMsg = data.data.message + "...Redirecting";
                        $timeout(function () {
                            $location.path('/login');
                        }, 2000);
                    } else {
                        app.errMsg = data.data.message;
                    }
                });
            } else {
                app.loading = false;
                app.disabled = false;
                app.errMsg = "Please ensure form is filled out properly."
            }
        }
    });


