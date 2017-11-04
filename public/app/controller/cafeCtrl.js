angular.module('cafeController', ['cafeServices'])
    .controller("cafeCtrl", function (Cafe,$scope) {
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
    });
