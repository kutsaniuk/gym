(function () {
    'use strict';

    angular
        .module('main')
        .controller('PostsNewCtrl', PostsNewCtrl);

    function PostsNewCtrl($scope, $state, PostsService, AuthService, ngDialog) {
        var sc = $scope;
        sc.addPost = true;

        sc.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight'],
            ['html', 'insertImage','insertLink', 'insertVideo']
        ];

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

        sc.createPost = function (post) {
            function success(response) {
                console.log(response.status);
            }
        
            function failed(response) {
                console.log(response.status);
            }

            post.created = new Date().toISOString();
            post.users_id = 1; // CURRENT USER !!! 

            PostsService.create(post).then(success, failed);
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
