(function () {
    'use strict';

    angular
        .module('contact', [
            'ui.router'
        ])
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider'];
    function configure($stateProvider, $urlRouterProvider) {
         
        $stateProvider
            .state('main.contact', {
                url: 'contact',
                templateUrl: 'app/contact/contact.view.html'
            });

    }

})();
