angular.module('transactionController', ['transactionServices', 'managementServices'])
    .controller('transactionCtrl', function (TransactionService, Management, $rootScope) {
        console.log('transaction controller');

        var app = this;
        app.loading = true;
        app.errMsg = false;
        app.succMsg = false;
        app.selectedMenu = {};
        app.cart = {};
        app.cart.panels = [];
        app.getMenu = function () {

            if ($rootScope.loggedInUser) {

                Management.menuByCafe($rootScope.loggedInUser.cafeId, true).then(function (data) {

                    if (data.data.success) {
                        app.menu = data.data.menus;
                        app.loading = false;

                    } else {
                        app.errorMsg = data.data.message;
                        app.loading = false;
                    }
                });
            }
        }
        app.getMenu();

        app.changeMenu = function (menu) {
            console.log(menu);
            app.selectedMenu = menu;
        }

        app.addToCart = function (submenu) {
            app.cart.panels.push({ qty: 1, total: submenu.price, _id: submenu._id, name: submenu.name });
            console.log(app.cart.panels);
        }
    }); 