(function () {
    'use strict';

    angular
        .module('app.components.composite')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
            .state('triangular.composite', {
                url: '/composite',
                templateUrl: 'app/components/composite/composite.tmpl.html',
                controller: 'CompositeController',
                controllerAs: 'vm',
                data: {
                    layout: {
                        contentClass: 'layout-column'
                    },
                    permissions: {
                        only: ['viewComposite'],
                        redirectTo: 'authentication.login'
                    }
                }
            });

        triMenuProvider.addMenu({
            name: 'Composite',
            icon: 'zmdi zmdi-calendar-check',
            type: 'link',
            state: 'triangular.composite',
            priority: 3.3,
        });
        triMenuProvider.addMenu({
            type: 'divider',
            priority: 3.4
        });
    }
})();
