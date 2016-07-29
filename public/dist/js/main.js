(function () {
    'use strict';

    angular
        .module('main', [
            'home',
            'news',
            'contact',
            'ui.router',
            'ui.bootstrap',
            'ngCookies',
            'ngAnimate',
            'ngDialog',
            'flow',
            'base64',
            'naif.base64',
            'pascalprecht.translate',
            'cr.acl'
        ])
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$translateProvider'];
    function configure($stateProvider, $urlRouterProvider, $translateProvider) {

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go('main.home');
        });

        $stateProvider
            .state('main', {
                url: '/',
                abstract: true,
                templateUrl: 'app/main.view.html'
            });

    }

})();

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
