angular.module('cafeController', ['cafeServices'])
    .controller("cafeCtrl", function (Cafe, $scope) {

        var app = this;
        app.loading = true;
        app.errMsg = false;
        app.succMsg = false;

        this.showCreateForm = false;


        app.getCafes = function () {

            Cafe.getCafes().then(function (data) {
                if (data.data.success) {
                    if (data.data.permission === 'admin') {
                        app.cafes = data.data.cafes;
                        app.loading = false;
                        // app.accessDenied = false;

                        // if (data.data.permission === 'admin') {
                        //     app.editAccess = true;
                        //     app.deleteAccess = true;
                        // } else if (data.data.permission === 'moderator') {
                        //     app.editAccess = true;
                        //     app.deleteAccess = false;
                        // }
                    } else {
                        app.errorMsg = "Insifficient permissions.";
                        app.loading = false;
                        // app.accessDenied = false;
                    }
                } else {
                    app.errorMsg = data.data.message;
                    app.loading = false;
                }
            });
        }
        app.getCafes();


        this.addCafe = function (cafeData, valid) {

            var app = this;
            this.addCafe = function (cafeData, valid) {
                app.loading = true;
                app.errMsg = false;
                app.succMsg = false;

                if (valid) {
                    Cafe.create(app.cafeData)
                        .then(function (data) {
                            app.loading = false;
                            if (data.data.success) {
                                app.succMsg = data.data.message;
                                app.getCafes();
                                app.showCreateForm = false;
                                app.cafeData = {};
                                $scope.cafeForm.$setPristine();
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
        }

    });

