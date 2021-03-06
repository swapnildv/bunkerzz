angular.module('transactionController', ['transactionServices', 'managementServices', 'exportToExcel'])
    .controller('transactionCtrl', function (TransactionService, Management, $rootScope, $scope) {


        var app = this;
        app.loading = true;
        app.errMsg = false;
        app.succMsg = false;
        app.selectedMenu = {};

        // app.cart = {};
        // app.cart.panels = [];
        app.orderData = {};
        app.getMenu = function () {
            console.log($rootScope.loggedInUser.cafeId);
            if ($rootScope.loggedInUser) {
                if (!$rootScope.loggedInUser.cafeId) {
                    app.errorMsg = 'Invalid cafe Details';
                    app.loading = false;
                }


                Management.menuByCafe($rootScope.loggedInUser.cafeId, true).then(function (data) {

                    if (data.data.success) {
                        app.menu = data.data.menus;
                        app.loading = false;
                        //initilise order data.


                        app.orderData.cafeid = $rootScope.loggedInUser.cafeId;
                        app.orderData.user = $rootScope.loggedInUser._id;
                        app.orderData.details = [];
                        //get cafe details
                        Management.getCafeById($rootScope.loggedInUser.cafeId).then(function (data) {
                            if (data.data.success) {
                                app.orderData.cafe = data.data.cafe;
                            }
                        });

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
            $scope.Menusearch = '';
            $scope.Submenusearch = '';
        }

        app.removeFromCart = function (panel) {

            var index = app.orderData.details.indexOf(panel);
            if (index != null) {
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
                        app.printData = angular.copy(app.orderData);
                        app.printData.transaction = data.data.transaction;
                        app.orderData.details = [];
                        app.orderData.customername = '';
                        app.orderData.customerphone = '';
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


        $scope.Print = function () {

            var printContents, popupWin;
            printContents = document.getElementById('print-section').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            //popupWin.document.open();
            popupWin.document.write(`
                  <html>
                    <head>
                      <title>Bet Summary</title>
                      <style type="text/css" media="print">
                        @page 
                        {
                            size: auto;   /* auto is the initial value  */
                            margin: 0mm;  /* this affects the margin in the printer settings */
                            margin-left: 3mm;
                            /* margin-right: 0mm !important;  */
                        }
                        body {
                          font-size:12px !important;
                        }
            
            
                        /*  html
                        {
                            background-color: #FFFFFF; 
                            margin: 0px;  /* this affects the margin on the html before sending to printer */
                        }
            
                        body
                        {
                            border: solid 1px blue ;
                            margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
                        }   */
            
            
                      </style>
                      <!-- Latest compiled and minified CSS -->
                          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" 
                          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            
                          <!-- Optional theme -->
                          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" 
                          integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
            
                          <!-- Latest compiled and minified JavaScript -->
                          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" 
                          integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
                    </head>
                        <body onload="window.print();window.close();">${printContents}</body>
                  </html>`
            );
            popupWin.document.close();
        }

        Array.prototype.sum = function (prop) {
            var total = 0
            for (var i = 0, _len = this.length; i < _len; i++) {
                total += this[i][prop]
            }
            return total
        }
    }).controller('reportCtrl', function (TransactionService, Management, exportToExcelFactory, $timeout, $rootScope, $scope) {
        //console.log(reportCtrl);
        var app = this;
        app.loading = false;
        app.errMsg = false;
        app.succMsg = false;
        app.maxDate = new Date();
        app.selectedcafe = '';
        $scope.fromDateModel = new Date();
        $scope.toDateModel = new Date();
        //watch on fromDate.
        $scope.$watch('fromDateModel', validateDates);
        $scope.$watch('toDateModel', validateDates);

        function validateDates() {
            if (!$scope.fromDateModel || !$scope.toDateModel) return;
            if (!$scope.myForm.fromDateControl.$valid || !$scope.myForm.toDateControl.$valid) {
                $scope.myForm.fromDateControl.$setValidity("endBeforeStart", true);  //already invalid (per validDate directive)
            }
            else {
                var toDate = new Date($scope.toDateModel);
                var fromDate = new Date($scope.fromDateModel);
                $scope.myForm.fromDateControl.$setValidity("endBeforeStart", toDate >= fromDate);
            }
        }
        function calcTotal() {
            $scope.total = 0;
            $scope.totalcgst = 0
            $scope.totalsgst = 0;

            app.transactions.forEach(element => {
                $scope.total += element.totalcost;
                $scope.totalcgst += element.cgst;
                $scope.totalsgst += element.sgst;
            });

        }

        app.getTransactionReports = function (isValid) {
            if (isValid) {
                app.errMsg = false;
                app.succMsg = false;
                app.loading = true;

                var reportData = { cafeid: app.selectedcafe, fromdate: $scope.fromDateModel, todate: $scope.toDateModel };
                reportData.fromdate = new Date(reportData.fromdate.setHours(0, 0, 0));
                reportData.todate = new Date(reportData.todate.setHours(23, 59, 59));

                console.log(reportData);
                //console.log(reportData.fromdate.setHours('0,0,0,0'));

                if ($rootScope.loggedInUser) {
                    TransactionService.getTransactionReport(reportData).then(function (data) {
                        if (data.data.success) {
                            app.transactions = data.data.transactions;
                            calcTotal();
                            app.loading = false;

                        } else {
                            app.errorMsg = data.data.message;
                            app.loading = false;
                        }
                    });
                }
            }
            else {
                app.loading = false;
                app.errMsg = "Please ensure required data is valid!";
                app.transactions = [];
            }
        }
        app.exportToExcel = function (tableId) {
            // ex: '#my-table'
            debugger;
            var exportHref = exportToExcelFactory.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () { location.href = exportHref; }, 100); // trigger download
        };

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        app.loadReport = function () {
            //check user role 
            if ($rootScope.loggedInUser) {
                if ($rootScope.loggedInUser.permission === 'admin') {
                    //get cafe list.
                    app.errMsg = false;
                    app.succMsg = false;
                    app.loading = true;
                    Management.getCafes().then(function (data) {
                        if (data.data.success) {
                            app.cafeList = data.data.cafes;
                            app.loading = false;
                        } else {
                            app.errorMsg = data.data.message;
                            app.loading = false;
                        }
                    });
                } else {
                    if ($rootScope.loggedInUser.cafeId) {
                        app.selectedcafe = $rootScope.loggedInUser.cafeId;
                    }
                }
            }



        }

        app.loadReport();

    });