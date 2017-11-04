angular.module('cafeServices', [])
    .factory('Cafe', function ($http) {
        var cafeFactory = {};
        //Cafe.create(regData)
        cafeFactory.create = function (cafeData) {
            return $http.post('/api/cafe', cafeData)
        }

<<<<<<< HEAD
        //Cafe.getCafes();
        cafeFactory.getCafes = function () {
            return $http.get('/api/cafe')
        }
=======
>>>>>>> 7c9d157db847ed2035e6e0f3897347fff2188529
        return cafeFactory;
    });