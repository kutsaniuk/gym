(function () {
    'use strict';

    angular
        .module('users', [
            'ui.router'
        ])
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider'];
    function configure($stateProvider, $urlRouterProvider) {
        
        $stateProvider
            .state('main.users', {
                url: 'users',
                controller: 'UsersCtrl',
                templateUrl: 'app/admin/users/users.view.html',
                data: {
                    is_granted: ["ROLE_ADMIN"]
                }
            });
 
    }

})();
