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
        .module('main')
        .controller('AuthCtrl', AuthCtrl);

    function AuthCtrl($scope, $state, AuthService, crAcl, $translate, CredentialsService, EventService) {
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

        sc.login = function (username, password) {
            AuthService.login(username, password)
                .then(function successCallback(response) {
                    CredentialsService.SetCredentials(response.data.id, sc.username, sc.password, response.data.role);
                    crAcl.setRole(response.data.role);

                    switch (crAcl.getRole()) {
                        case 'ROLE_USER':
                            $state.go('main.user.feed');  
                            break;
                        case 'ROLE_ADMIN':
                            $state.go('main.user.dashboard'); 
                            break;
                    }

                    sc.user = response.data;
                }, function errorCallback(response) {
                    sc.authFailed = true;
                });
        };

        sc.register = function () {
            sc.user.created = new Date().toISOString();
            sc.user.language = sc.lang;
            if (sc.user.email != '' &&
                sc.user.name != '' &&
                sc.user.username != '' &&
                sc.user.password != '' &&
                sc.registerForm.$valid && sc.usernameCheked) AuthService.register(sc.user)
                .then(function successCallback(response) {
                    sc.login(sc.user.username, sc.user.password);
                }, function errorCallback(response) {
                    alert('failed');
                });
            else sc.emtryField = true;
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

        sc.getPageEvents = function (page, limit, type, name) {

            var getPageSuccess = function (response) {
                sc.events = response.data;
            };

            var getPageFailed = function (response) {
                alert(response.status);
            };

            EventService.getPage(page, limit, type, name).then(getPageSuccess, getPageFailed);
        };

        sc.setLang = function (lang) {
            $translate.use(lang);
            sc.lang = lang;
            sc.langShow = !sc.langShow;
        }
    }
})();

(function () {
    'use strict';

    angular
    .module('main')
    .service('AuthService', function ($http) {

        var urlBase = '/auth';

        this.login = function (username, password, callback) {
            return $http.post(urlBase + '/login', { username: username, password: password });
        };

        this.register = function (user) {
            return $http.post(urlBase + '/register', user);
        };

        this.check = function (username) {
            return $http.get(urlBase + '/check', {
                params: {
                    username: username
                }
            });
        };

    });

    angular
    .module('main')
    .factory('CredentialsService',
    function (Base64, $http, $cookieStore, $rootScope) {
        var service = {};
 
        service.SetCredentials = function (id, username, password, role) {
            var authdata = Base64.encode(username + ':' + password);
 
            $rootScope.globals = {
                currentUser: {
                    id: id,
                    username: username,
                    role: role,
                    authdata: authdata
                }
            };
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
    });

    angular
    .module('main')
    .factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },

    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            window.alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
    }
    };

    /* jshint ignore:end */
    });
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

(function () {
    'use strict';

    angular
        .module('main')
        .controller('UsersCtrl', UsersCtrl);

    function UsersCtrl($scope, UsersService, AuthService, ngDialog) {
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
            sc.registerUser = true;
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
            sc.registerUser = false;

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
        }

    }
})();

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
                templateUrl: 'app/admin/users/users.view.html'
            });

    }

})();

(function () {
    'use strict';

    angular
        .module('main')
        .service('UsersService', function ($http) {

            var urlBase = '/user';

            this.getPage = function (page, limit) {
                return $http.get(urlBase, {
                    params: {
                        page: page,
                        limit: limit
                    }
                });
            };

            this.getById = function (id) {
                return $http.get(urlBase + '/profile/' + id);
            };

            this.active = function (user) {
                return $http.post(urlBase + '/active', user);
            };

            this.role = function (user) {
                return $http.post(urlBase + '/role', user);
            };

            this.update = function (user) {
                return $http.post(urlBase + '/update', user);
            };

        });
})();
(function () {
    'use strict';

    angular
        .module('main')
        .controller('PostsCtrl', PostsCtrl);

    function PostsCtrl($scope, PostsService, AuthService, ngDialog) {
        var sc = $scope;

        sc.getPosts = function (page, limit) {

            function success(response) {
                sc.posts = response.data;
            }

            function failed(response) {
                sc.posts = response.data;
                console.log(response.status);
            }

            PostsService.getPage(page, limit).then(success, failed);
        };

        sc.getPostById = function (id) {

            function success(response) {
                sc.post = response.data;
            }

            function failed(response) {
                sc.post = response.data;
                console.log(response.status);
            }

            PostsService.getById(id).then(success, failed);
        };

        sc.openCreatePost = function () {
            sc.post = null;
            sc.createPost = true;
            sc.editPost = false;

            ngDialog.open({
                template: 'app/admin/posts/new/posts.new.view.html',
                className: 'ngdialog-theme-default',
                showClose: true,
                scope: $scope
            });
        };

        sc.openEditPost = function (id) {
            sc.getPostById(id);
            sc.editPost = true;
            sc.createPost = false;

            ngDialog.open({
                template: 'app/admin/posts/new/posts.new.view.html',
                className: 'ngdialog-theme-default',
                showClose: true,
                scope: $scope
            });
        };

        sc.removePost = function (id) {
            function success(response) {
                sc.getPosts(1, 9);
            }

            function failed(response) {
                sc.posts = response.data;
                console.log(response.status);
            }

            PostsService.remove(id).then(success, failed);
        };

        // sc.registerUser = function (user) {
        //     function success(response) {
        //         console.log(response.status);
        //     }
        //
        //     function failed(response) {
        //         console.log(response.status);
        //     }
        //
        //     user.created = new Date().toISOString();
        //     user.language = 'uk';
        //
        //     AuthService.register(user).then(success, failed);
        // };
        //
        // sc.updateUser = function (user) {
        //     function success(response) {
        //         console.log(response.status);
        //     }
        //
        //     function failed(response) {
        //         console.log(response.status);
        //     }
        //
        //     UsersService.update(user).then(success, failed);
        // }

    }
})();

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

(function () {
    'use strict';

    angular
        .module('main')
        .service('PostsService', function ($http) {

            var urlBase = '/news';

            this.getPage = function (page, limit) {
                return $http.get(urlBase, {
                    params: {
                        page: page,
                        limit: limit
                    }
                });
            };

            this.getById = function (id) {
                return $http.get(urlBase + '/post/' + id);
            };

            this.update = function (post) {
                return $http.post(urlBase + '/update', post);
            };

            this.remove = function (post) {
                return $http.post(urlBase + '/remove', post);
            };

        });
})();