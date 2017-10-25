angular.module('userController', ['userServices'])
    .controller('regCtrl', function ($http, $location, $timeout, User) {

        var app = this;
        this.regUser = function (regData) {
            app.loading = true;
            app.errMsg = false;
            app.succMsg = false;

            User.create(app.regData)
                .then(function (data) {
                    app.loading = false;
                    if (data.data.success) {
                        //create success mesage
                        //Redirect to home page.
                        app.succMsg = data.data.message + "...Redirecting";
                        $timeout(function () {
                            $location.path('/');
                        }, 2000);

                    }
                    else {
                        //Create error message
                        app.errMsg = data.data.message;
                    }
                });
        }
    });