(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .controller('SignupController', SignupController);

    /* @ngInject */
    function SignupController($scope, $state, $mdToast, $http, $filter, triSettings, UserService, triLoaderService, $timeout) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.signupClick = signupClick;
        vm.user = {
            name: '',
            email: '',
            password: '',
            confirm: ''
        };

        ////////////////

        function signupClick() {

            console.log(vm.user);

            // // turn the loader on
            // triLoaderService.setLoaderActive(true);

            // // wait for a while
            // $timeout(function() {
            //     // now turn it off
            //     triLoaderService.setLoaderActive(false);
            // }, vm.time * 1000);


            UserService.register(vm.user).then(function (res) {

                vm.user.password = '';
                vm.user.confirm = '';


                $scope.signup.$setUntouched(true);
                $scope.signup.$setPristine(true);

                console.log(res);

                if (res && res.result == true) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content($filter('triTranslate')('Account created!'))
                            .position('bottom right')
                            .action($filter('triTranslate')('Login'))
                            .highlightAction(true)
                            .hideDelay(0)
                    ).then(function () {
                        $state.go('authentication.login');
                    });
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .content($filter('triTranslate')('Account not created! Email or name is already been used.'))
                            .position('bottom right')
                            .action($filter('triTranslate')('OK'))
                            .highlightAction(true)
                            .hideDelay(0)
                    ).then(function () {
                    });
                }
            });


        }
    }
})();
