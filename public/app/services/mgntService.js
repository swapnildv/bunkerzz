angular.module('managementServices', [])
    .factory('Management', function ($http) {
        var mgmtFactory = {};
        //Management.create(regData)
        mgmtFactory.create = function (cafeData) {
            return $http.post('/api/cafe', cafeData)
        }

        //Management.getCafes();
        mgmtFactory.getCafes = function () {
            return $http.get('/api/cafe')
        }

        //Management.menu();
        mgmtFactory.createMenu = function (menuData) {
            return $http.post('/api/menu', menuData);
        }

        //Management.menuByCafe();
        mgmtFactory.menuByCafe = function (cafeid) {
            return $http.get('/api/menu/' + cafeid);
        }

        //Management.updateMenuById();
        mgmtFactory.updateMenuById = function (menuData) {
            return $http.put('/api/menu/', menuData);
        }

        return mgmtFactory;
    });