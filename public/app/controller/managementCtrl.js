angular.module('managementController', ['userServices', 'managementServices'])
    .controller('managementCtrl', function (User) {
        var app = this;
        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editAccess = false;
        app.deleteAccess = false;
        User.getUsers().then(function (data) {
            if (data.data.success) {
                if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                    app.users = data.data.users;
                    app.loading = false;
                    app.accessDenied = false;
                    if (data.data.permission === 'admin') {
                        app.editAccess = true;
                        app.deleteAccess = true;
                    } else if (data.data.permission === 'moderator') {
                        app.editAccess = true;
                        app.deleteAccess = false;
                    }
                } else {
                    app.errorMsg = "Insifficient permissions.";
                    app.loading = false;
                    app.accessDenied = false;
                }
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        });
    })
    .controller("cafeCtrl", function (Management, $scope) {

        var app = this;
        app.loading = true;
        app.errMsg = false;
        app.succMsg = false;

        this.showCreateForm = false;


        app.getCafes = function () {
            Management.getCafes().then(function (data) {
                if (data.data.success) {
                    if (data.data.permission === 'admin') {
                        app.cafes = data.data.cafes;
                        app.loading = false;
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

        app.addCafe = function (cafeData, valid) {
            app.loading = true;
            app.errMsg = false;
            app.succMsg = false;

            if (valid) {
                Management.create(app.cafeData)
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

    }).controller('menuCtrl', function (Management, $routeParams, $scope) {

        var app = this;
        app.loading = true;
        app.errMsg = false;
        app.succMsg = false;
        app.submenus = [];
        app.showCreateForm = false;
        app.menuEditMode = false;
        app.editing = false;

        app.getMenus = function () {
            Management.menuByCafe($routeParams.cafeid).then(function (data) {
                if (data.data.success) {
                    app.menus = data.data.menus;
                    app.loading = false;
                }
            });
        }
        app.getMenus();

        app.addmenu = function (menuData, isValid) {
            app.loading = true;
            app.errMsg = false;
            app.succMsg = false;
            if (isValid) {
                app.menuData.cafeid = $routeParams.cafeid;
                Management.createMenu(app.menuData)
                    .then(function (data) {
                        app.loading = false;
                        if (data.data.success) {
                            app.succMsg = data.data.message;
                            app.getMenus();
                            app.loading = false;
                            app.errMsg = false;
                            app.showCreateForm = false;
                            app.menuData = {};
                            $scope.menuForm.$setPristine();
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



        app.menuEdit = function (menu) {
            app.cancelUpdate();
            menu.menuEditMode = !menu.menuEditMode;
            app.editing = app.menus.indexOf(menu);
            app.newField = angular.copy(menu);
        }


        app.menuUpdate = function (menu) {
            app.loading = true;
            app.errMsg = false;
            app.succMsg = false;
            Management.updateMenuById(menu)
                .then(function (data) {
                    app.loading = false;
                    if (data.data.success) {
                        app.succMsg = data.data.message;
                        app.getMenus();
                        app.loading = false;
                        app.menuData = {};
                        app.bufferMenu = {};
                        $scope.menuForm.$setPristine();
                    }
                    else {
                        //Create error message
                        app.errMsg = data.data.message;

                    }
                });
        }

        app.cancelUpdate = function () {
            if (app.editing !== false) {
                app.newField.menuEditMode = !app.newField.menuEditMode;
                app.menus[app.editing] = app.newField;
                app.editing = false;
            }

        }

        app.addSubmenu = function (menu, submenu, isValid) {
            menu.submenus = [];
            menu.submenus.push(app.submenu);
            if (isValid) {
                app.menuUpdate(menu);
                app.submenu = {};
            } else {
                app.loading = false;
                app.errMsg = "Please ensure form is filled properly";
            }
            // app.submenus.push(app.submenu);
            // app.submenu = {};
        }

    });
