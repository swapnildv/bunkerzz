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
        mgmtFactory.menuByCafe = function (cafeid, isFilter) {
            return $http.get('/api/menu/' + cafeid + '/' + isFilter);
        }

        //Management.menuByCafe();
        mgmtFactory.getCafeById = function (cafeid) {
            return $http.get('/api/cafe/' + cafeid);
        }

        //Management.updateCafe();
        mgmtFactory.updateCafe = function (cafedata) {
            return $http.put('/api/cafe/' , cafedata);
        }



        //Management.updateMenuById();
        mgmtFactory.updateMenuById = function (menuData) {
            return $http.put('/api/menu/', menuData);
        }
        //Management.addSubmenu();
        mgmtFactory.addSubmenu = function (submenuData) {
            return $http.put('/api/submenu/', submenuData);
        }

        //Management.getMenuByCafe(cafeid);
        // mgmtFactory.getMenuByCafe = function (cafeid) {
        //     return $http.get('/api/menu/' + cafeid);
        // }



        return mgmtFactory;
    });