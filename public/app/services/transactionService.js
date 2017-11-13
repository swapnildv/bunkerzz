angular.module('transactionServices', [])
    .factory('TransactionService', function ($http) {
        var transactionFactory = {};

        //TransactionService.placeOrder(orderData);
        transactionFactory.placeOrder = function (orderData) {
            return $http.post('/api/transaction', orderData)
        }

        return transactionFactory;

     });