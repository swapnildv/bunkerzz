angular.module('userServices', [])
    .factory('User', function ($http) {
        var userFactory = {};

        //User.create(regData)
        userFactory.create = function (regData) {
            return $http.post('/api/users', regData)
        }

        //User.checkUsername(regData)
        userFactory.checkUsername = function (regData) {
            return $http.post('/api/checkusername', regData)
        }

        //User.checkEmail(regData)
        userFactory.checkEmail = function (regData) {
            return $http.post('/api/checkemail', regData)
        }

        //User.sendPassword(userData)
        userFactory.sendPassword = function (userData) {
            return $http.put('/api/resetpassword/', userData);
        }

        //User.resetPassword(userData)
        userFactory.resetPassword = function (token) {
            return $http.get('/api/resetpassword/' + token);
        }

        //User.savePassword(regData)
        userFactory.savePassword = function (regData) {
            return $http.put('/api/savepassword/', regData);
        }

        //User.savePassword(regData)
        userFactory.getPermission = function () {
            return $http.get('/api/permission/');
        }

        //User.getUsers()
        userFactory.getUsers = function () {
            console.log('call');
            return $http.get('/api/management/');
        }


        return userFactory;
    });