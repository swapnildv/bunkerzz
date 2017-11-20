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
                        if (app.cafes.length > 0)
                            app.showCreateForm = false;
                        else
                            app.showCreateForm = true;
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

        app.cancelForm = function () {
            app.showCreateForm = false;
            app.cafeData = {};
            app.FormMode = '';
        }

        app.createCafeButton = function () {
            app.showCreateForm = true;
            app.errMsg = false;
            app.succMsg = false;
            app.FormMode = 'create';
        }

        app.editCafeButton = function (editCafeData) {
            app.showCreateForm = true;
            app.cafeData = editCafeData;
            app.FormMode = 'edit';
        }

        app.addCafe = function (cafeData, valid) {
            app.loading = true;
            app.errMsg = false;
            app.succMsg = false;
            if (app.FormMode == 'create') {

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
            else if (app.FormMode == 'edit') {

                if (valid) {
                    Management.updateCafe(app.cafeData)
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

    }).controller('menuCtrl', function (Management, $routeParams, $scope) {

        var app = this;
        app.loading = true;
        app.errMsg = false;
        app.succMsg = false;
        app.submenus = [];
        app.showCreateForm = false;
        app.menuEditMode = false;
        app.editing = false;
        app.isActiveOptions = [true, false];

        app.getMenus = function () {
            Management.menuByCafe($routeParams.cafeid, false).then(function (data) {
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
                        app.editing = false;
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

        app.addSubmenu = function (menu, isValid) {
            var submenuData = { _id: menu._id, submenu: menu.submenu };
            if (isValid) {
                app.loading = true;
                app.errMsg = false;
                app.succMsg = false;
                Management.addSubmenu(submenuData)
                    .then(function (data) {
                        app.loading = false;
                        if (data.data.success) {
                            app.succMsg = data.data.message;
                            //app.getMenus();
                            menu.submenus = data.data.submenus;
                            app.loading = false;
                            menu.submenu = {};
                            menu.submenuForm.$setPristine();
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
