angular.module('cafeServices', [])
    .factory('Cafe', function ($http) {
        var cafeFactory = {};
        //Cafe.create(regData)
        cafeFactory.create = function (cafeData) {
            return $http.post('/api/cafe', cafeData)
        }

        //Cafe.getCafes();
        cafeFactory.getCafes = function () {
            return $http.get('/api/cafe')
        }
        return cafeFactory;
    });