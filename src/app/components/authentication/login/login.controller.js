(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($state, triSettings, UserService, $mdToast, $filter) {
        var vm = this;
        vm.loginClick = loginClick;
        vm.socialLogins = [{
            icon: 'fa fa-twitter',
            color: '#5bc0de',
            url: '#'
        }, {
            icon: 'fa fa-facebook',
            color: '#337ab7',
            url: '#'
        }, {
            icon: 'fa fa-google-plus',
            color: '#e05d6f',
            url: '#'
        }, {
            icon: 'fa fa-linkedin',
            color: '#337ab7',
            url: '#'
        }];
        vm.triSettings = triSettings;
        // create blank user variable for login form
        vm.user = {
            email: '',
            password: ''
        };


        UserService.getCurrentUser().then(function(res) {
            if(res && res.result){
                $state.go('triangular.composite');
            }
        });

        ////////////////

        function loginClick() {
            // $state.go('triangular.dashboard-analytics');

            UserService.login(vm.user).then(function(res) {
                console.log(res);

                if (res && res.result == true) {
                    $state.go('triangular.composite');
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .content($filter('triTranslate')('Email or password is not right.'))
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
