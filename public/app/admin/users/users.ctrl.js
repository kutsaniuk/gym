(function () {
    'use strict';

    angular
        .module('main')
        .controller('UsersCtrl', UsersCtrl);

    function UsersCtrl($scope, $state, crAcl, UsersService, AuthService, CredentialsService, ngDialog) {
        var sc = $scope;

        sc.getUsers = function (page, limit) {
            
            function success(response) {
                sc.users = response.data;
            }

            function failed(response) {
                sc.users = response.data;
                console.log(response.status);
            }

            UsersService.getPage(page, limit).then(success, failed);
        };

        sc.getUserById = function (id) {

            function success(response) {
                sc.user = response.data;
            }

            function failed(response) {
                sc.user = response.data;
                console.log(response.status);
            }

            UsersService.getById(id).then(success, failed);
        };

        sc.setActiveUser = function (id, active) {

            var user = {
                'id': id,
                'active': !active
            };

            function success (response) {
                sc.getUsers(sc.currentPage, 9);
            }

            function failed(response) {
                alert(response.status);
            }

            UsersService.active(user).then(success, failed);


        };

        sc.setRoleUser = function (id, role) {

            var user = {
                'id': id,
                'role': role
            };

            var success = function (response) {
                // sc.getUsers(1, 9);
            };

            var failed = function (response) {
                alert(response.status);
            };

            UsersService.role(user).then(success, failed);


        };

        sc.openRegisterUser = function () {
            sc.user = null;
            sc.addUser = true;
            sc.editUser = false;

            ngDialog.open({
                template: 'app/admin/users/new/users.new.view.html',
                className: 'ngdialog-theme-default',
                showClose: true,
                scope: $scope
            });
        };

        sc.openEditUser = function (id) {
            sc.getUserById(id);
            sc.editUser = true;
            sc.addUser = false;

            ngDialog.open({
                template: 'app/admin/users/new/users.new.view.html',
                className: 'ngdialog-theme-default',
                showClose: true,
                scope: $scope
            });
        };
        
        sc.registerUser = function (user) {
            function success(response) {
                console.log(response.status);
            }

            function failed(response) {
                console.log(response.status);
            }

            user.created = new Date().toISOString();
            user.language = 'uk';

            AuthService.register(user).then(success, failed);
        };

        sc.updateUser = function (user) {
            function success(response) {
                console.log(response.status);
            }

            function failed(response) {
                console.log(response.status);
            }

            UsersService.update(user).then(success, failed);
        };

        sc.logout = function () {
            CredentialsService.ClearCredentials();
            crAcl.setRole("ROLE_GUEST");
            $state.go('main.home');
        }

    }
})();
