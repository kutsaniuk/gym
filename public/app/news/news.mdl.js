(function () {
    'use strict';

    angular
        .module('news', [
            'ui.router'
        ])
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider'];
    function configure($stateProvider, $urlRouterProvider) {
        
        $stateProvider
            .state('main.news', {
                url: 'news',
                templateUrl: 'app/news/news.view.html'
            });

    }

})();
