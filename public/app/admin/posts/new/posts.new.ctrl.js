(function () {
    'use strict';

    angular
        .module('main')
        .controller('PostsNewCtrl', PostsNewCtrl);

    function PostsNewCtrl($scope, $state, PostsService, $rootScope, ngDialog) {
        var sc = $scope;
        sc.addPost = true;

        sc.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight'],
            ['html', 'insertImage','insertLink', 'insertVideo']
        ];

        sc.createPost = function (post) {
            function success(response) {
                console.log(response.status);
                $state.go('main.posts');
            }
        
            function failed(response) {
                console.log(response.status);
            }

            post.created = new Date().toISOString();
            post.users_id = $rootScope.globals.currentUser.id;
            post.image = sc.image.base64;
            post.filetype = sc.image.filetype; 

            PostsService.create(post).then(success, failed);
        }

    }
})();
