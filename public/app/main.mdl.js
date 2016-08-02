(function () {
    'use strict';

    angular
        .module('main', [
            'home',
            'news',
            'contact',
            'users',
            'posts',
            'ui.router',
            'ui.bootstrap',
            'ngCookies',
            'ngAnimate',
            'ngDialog',
            'flow',
            'base64',
            'naif.base64',
            'pascalprecht.translate',
            'cr.acl',
            'textAngular'
        ])
        .config(configure)
        .run(run);

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
                controller: 'UsersCtrl',
                templateUrl: 'app/main.view.html'
            })
            .state('login', {
                url: '/login',
                controller: 'AuthCtrl',
                templateUrl: 'app/auth/auth.view.html'
            });

    }

    run.$inject = ['$rootScope', '$cookieStore', '$state', '$translate', '$http', 'UsersService', 'crAcl'];
    function run($rootScope, $cookieStore, $state, $translate, $http, UsersService, crAcl) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};

        crAcl.setInheritanceRoles({
            "ROLE_ADMIN": ["ROLE_ADMIN"],
            "ROLE_EDITOR": ["ROLE_EDITOR"],
            "ROLE_GUEST": ["ROLE_GUEST"]
        });

        crAcl.setRedirect('main.home');

        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata.id;
            crAcl.setRole($rootScope.globals.currentUser.role);
        }
        else crAcl.setRole("ROLE_GUEST");

    }

})();
