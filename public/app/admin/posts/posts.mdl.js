(function () {
    'use strict';

    angular
        .module('posts', [
            'ui.router'
        ])
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider'];
    function configure($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('main.posts', {
                url: 'posts',
                controller: 'PostsCtrl',
                templateUrl: 'app/admin/posts/posts.view.html',
                data: {
                    is_granted: ["ROLE_EDITOR"]
                }
            })
            .state('main.newPost', {
                url: 'post/new',
                controller: 'PostsNewCtrl',
                templateUrl: 'app/admin/posts/new/posts.new.view.html',
                data: {
                    is_granted: ["ROLE_EDITOR"]
                }
            })
            .state('main.editPost', {
                url: 'post/edit/:id',
                controller: 'PostsEditCtrl',
                templateUrl: 'app/admin/posts/new/posts.new.view.html',
                data: {
                    is_granted: ["ROLE_EDITOR"]
                }
            })
            .state('main.post', {
                url: 'post/:id',
                controller: 'PostCtrl',
                templateUrl: 'app/post/post.view.html',
                data: {
                    is_granted: ["ROLE_EDITOR"]
                }
            });
    }

})();
