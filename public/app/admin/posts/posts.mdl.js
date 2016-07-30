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
                templateUrl: 'app/admin/posts/posts.view.html'
            });

    }

})();
