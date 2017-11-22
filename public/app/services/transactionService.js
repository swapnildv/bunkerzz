angular.module('transactionServices', [])
    .factory('TransactionService', function ($http) {
        var transactionFactory = {};

        //TransactionService.placeOrder(orderData);
        transactionFactory.placeOrder = function (orderData) {
            return $http.post('/api/transaction', orderData)
        }

        //TransactionService.getTransactionReport()
        transactionFactory.getTransactionReport = function (reportData) {
            //var reqData = { fromdate: new Date(), toDate: new Date() };
            return $http.put('/api/reports/transaction/', reportData);
        }
        
        return transactionFactory;

    });