(function () {
    'use strict';

    angular
        .module('main')
        .service('PostsService', function ($http) {

            var urlBase = '/news';

            this.getPage = function (page, limit) {
                return $http.get(urlBase, {
                    params: {
                        page: page,
                        limit: limit
                    }
                });
            };

            this.getById = function (id) {
                return $http.get(urlBase + '/post/' + id);
            };

            this.update = function (post) {
                return $http.post(urlBase + '/update', post);
            };

            this.remove = function (post) {
                return $http.post(urlBase + '/remove', post);
            };
            
            this.create = function (post) {
                return $http.post(urlBase + '/create', post);
            };

        });
})();