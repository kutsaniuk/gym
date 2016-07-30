(function () {
    'use strict';

    angular
        .module('main')
        .service('UsersService', function ($http) {

            var urlBase = '/user';

            this.getPage = function (page, limit) {
                return $http.get(urlBase, {
                    params: {
                        page: page,
                        limit: limit
                    }
                });
            };

            this.getById = function (id) {
                return $http.get(urlBase + '/profile/' + id);
            };

            this.active = function (user) {
                return $http.post(urlBase + '/active', user);
            };

            this.role = function (user) {
                return $http.post(urlBase + '/role', user);
            };

            this.update = function (user) {
                return $http.post(urlBase + '/update', user);
            };

        });
})();