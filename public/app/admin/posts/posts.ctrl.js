(function () {
    'use strict';

    angular
        .module('main')
        .controller('PostsCtrl', PostsCtrl);

    function PostsCtrl($scope, PostsService, AuthService, ngDialog) {
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
            sc.post = null;
            sc.createPost = true;
            sc.editPost = false;

            ngDialog.open({
                template: 'app/admin/posts/new/posts.new.view.html',
                className: 'ngdialog-theme-default',
                showClose: true,
                scope: $scope
            });
        };

        sc.openEditPost = function (id) {
            sc.getPostById(id);
            sc.editPost = true;
            sc.createPost = false;

            ngDialog.open({
                template: 'app/admin/posts/new/posts.new.view.html',
                className: 'ngdialog-theme-default',
                showClose: true,
                scope: $scope
            });
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

        // sc.registerUser = function (user) {
        //     function success(response) {
        //         console.log(response.status);
        //     }
        //
        //     function failed(response) {
        //         console.log(response.status);
        //     }
        //
        //     user.created = new Date().toISOString();
        //     user.language = 'uk';
        //
        //     AuthService.register(user).then(success, failed);
        // };
        //
        // sc.updateUser = function (user) {
        //     function success(response) {
        //         console.log(response.status);
        //     }
        //
        //     function failed(response) {
        //         console.log(response.status);
        //     }
        //
        //     UsersService.update(user).then(success, failed);
        // }

    }
})();
