(function () {
    'use strict';

    angular
        .module('home', [
            'ui.router'
        ])
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider'];
    function configure($stateProvider, $urlRouterProvider) {
        
        $stateProvider
            .state('main.home', {
                url: '',
                templateUrl: 'app/home/home.view.html'
            });

    }

})();
