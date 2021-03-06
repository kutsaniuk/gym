(function () {
    'use strict';

    angular
        .module('main')
        .controller('PostsCtrl', PostsCtrl);

    function PostsCtrl($scope, $state, PostsService, $location, ngDialog) {
        var sc = $scope;

        sc.getPosts = function (page, limit) {

            function success(response) {
                sc.posts = response.data;
            }

            function failed(response) {
                sc.posts = response.data;
                console.log(response.status);
            }

            PostsService.getPage(page, limit).then(success, failed);
        };

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

        sc.openCreatePost = function () {
            $state.go('main.newPost');
        };

        sc.openEditPost = function (id) {
            $location.path('post/edit/' + id);
        };

        sc.removePost = function (id) {
            function success(response) {
                sc.getPosts(1, 9);
            }

            function failed(response) {
                sc.posts = response.data;
                console.log(response.status);
            }

            PostsService.remove(id).then(success, failed);
        };

        
        
        sc.updatePost = function (post) {
            function success(response) {
                console.log(response.status);
            }
        
            function failed(response) {
                console.log(response.status);
            }
        
            PostsService.update(post).then(success, failed);
        }

    }
})();
