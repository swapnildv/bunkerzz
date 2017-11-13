angular.module('transactionController', ['transactionServices', 'managementServices'])
    .controller('transactionCtrl', function (TransactionService, Management, $rootScope, $scope) {
        console.log('transaction controller');

        var app = this;
        app.loading = true;
        app.errMsg = false;
        app.succMsg = false;
        app.selectedMenu = {};

        // app.cart = {};
        // app.cart.panels = [];
        app.orderData = {};
        app.getMenu = function () {

            if ($rootScope.loggedInUser) {

                Management.menuByCafe($rootScope.loggedInUser.cafeId, true).then(function (data) {

                    if (data.data.success) {
                        app.menu = data.data.menus;
                        app.loading = false;
                        //initilise order data.
                        app.orderData.cafeid = $rootScope.loggedInUser.cafeId;
                        app.orderData.user = $rootScope.loggedInUser._id;
                        app.orderData.details = [];

                    } else {
                        app.errorMsg = data.data.message;
                        app.loading = false;
                    }
                });
            }
        }
        app.getMenu();

        app.changeMenu = function (menu) {
            app.selectedMenu = menu;
        }

        app.addToCart = function (submenu) {
            app.orderData.details.push({ qty: 1, cost: submenu.price, submenu_id: submenu._id, submenu: submenu.name, submenu_price: submenu.price });
        }

        app.removeFromCart = function (panel) {
            
            var index = app.orderData.details.indexOf(panel);
            if (index!=null) {
                app.orderData.details.splice(index, 1);
            }
        }

        app.getTotal = function () {
            if (app.orderData.details != null) {
                app.orderData.totalcost = app.orderData.details.sum('cost');
                return app.orderData.totalcost;
            }
            else
                return 0;
        }



        $scope.updateQty = function (panel, valid) {
            if (valid)
                panel.cost = panel.qty * panel.submenu_price;
            else
                panel.cost = 0;
        }

        app.placeOrder = function (isValid) {
            if (isValid) {
                console.log(app.orderData);
                app.loading = true;
                app.errMsg = false;
                app.succMsg = false;
                TransactionService.placeOrder(app.orderData).then(function (data) {
                    if (data.data.success) {
                        app.orderData.details = [];
                        app.loading = false;
                        app.succMsg = data.data.message;
                    } else {
                        app.errorMsg = data.data.message;
                        app.loading = false;
                    }
                });
            }
            else {
                app.loading = false;
                app.errMsg = "Please ensure order data is valid!";
            }
        }

        Array.prototype.sum = function (prop) {
            var total = 0
            for (var i = 0, _len = this.length; i < _len; i++) {
                total += this[i][prop]
            }
            return total
        }
    }); 