(function () {
    'use strict';

    angular
        .module('main')
        .controller('AuthCtrl', AuthCtrl);

    function AuthCtrl($scope, $state, AuthService, crAcl, $translate, CredentialsService) {
        var sc = $scope;

        CredentialsService.ClearCredentials();

        sc.lang = 'uk';
        sc.langShow = true;
        sc.user = {
            'email': '',
            'name': '',
            'username': '',
            'password': ''
        };
        sc.usernameCheckShow = false;
        $translate.use(sc.lang);

        sc.login = function (user) {
            AuthService.login(user.username, user.password)
                .then(function successCallback(response) {
                    CredentialsService.SetCredentials(response.data.id, user.username, user.password, response.data.role);
                    crAcl.setRole(response.data.role);

                    switch (crAcl.getRole()) {
                        case 'ROLE_EDITOR':
                            $state.go('main.posts');
                            break;
                        case 'ROLE_ADMIN':
                            $state.go('main.users');
                            break;
                    }

                    sc.user = response.data;
                }, function errorCallback(response) {
                    sc.authFailed = true;
                });
        };
        
        sc.checkUsername = function (username) {
            sc.usernameCheckShow = true;
            AuthService.check(username)
                .then(function successCallback(response) {
                    sc.usernameCheked = true;
                }, function errorCallback(response) {
                    sc.usernameCheked = false;
                });
        };

        sc.setLang = function (lang) {
            $translate.use(lang);
            sc.lang = lang;
            sc.langShow = !sc.langShow;
        }
    }
})();
