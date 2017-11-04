angular.module('cafeServices', [])
    .factory('Cafe', function ($http) {
        var cafeFactory = {};
        //Cafe.create(regData)
        cafeFactory.create = function (cafeData) {
            return $http.post('/api/cafe', cafeData)
        }

        return cafeFactory;
    });