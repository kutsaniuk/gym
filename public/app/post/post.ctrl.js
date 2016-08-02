(function () {
    'use strict';

    angular
        .module('main')
        .controller('PostCtrl', PostCtrl);

    function PostCtrl($scope, PostsService, $stateParams) {
        var sc = $scope;
        
        sc.postId = $stateParams.id;

        sc.getPostById = function (id) { 

            function success(response) {
                sc.post = response.data;
            }

            function failed(response) {
                sc.post = response.data;
                console.log(response.status);
            }

            PostsService.getById(id).then(success, failed);
        };

        sc.getPostById(sc.postId);

    }
})();
