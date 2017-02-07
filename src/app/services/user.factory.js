(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('UserService', UserService);

    /* @ngInject */
    function UserService($q, $http, $$http, RoleStore, API_CONFIG) {
        var service = this;


        service.currentUser = {
        };




        ///////////////

        service.getCurrentUser = function () {

            if (service.currentUser && service.currentUser._id) {
                var deferred = $q.defer();
                deferred.resolve({ result: true, data: service.currentUser });
                return deferred.promise;
            } else {
                return $$http.get('self').then(function(res) {
                    if(res && res.result){
                        service.currentUser = res.data;
                    }
                    return res;
                });
            }

        }


        service.register = function (data) {
            return $$http.post('user', {
                name: data.name,
                email: data.email,
                password: data.password
            });
        }

        service.logout = function(){
            service.currentUser = null;
            return $$http.get('logout');
        }

        service.testState = function () {
            return $$http.get('user');
        }

        service.getUsers = function () {
            return $http.get('app/services/permission/data/users.json');
        }

        service.hasPermission = function (permission) {
            var deferred = $q.defer();
            var hasPermission = false;

            // service
            service.getCurrentUser().then(function(res){
                if(res && res.result && permission==='viewComposite'){
                    deferred.resolve();
                }else{
                    deferred.reject();
                }
            })

            // check if user has permission via its roles
            // angular.forEach(currentUser.roles, function (role) {
            //     // check role exists
            //     if (RoleStore.hasRoleDefinition(role)) {
            //         // get the role
            //         var roles = RoleStore.getStore();

            //         if (angular.isDefined(roles[role])) {
            //             // check if the permission we are validating is in this role's permissions
            //             if (-1 !== roles[role].validationFunction.indexOf(permission)) {
            //                 hasPermission = true;
            //             }
            //         }
            //     }
            // });

            // // if we have permission resolve otherwise reject the promise
            // if (hasPermission) {
            //     deferred.resolve();
            // }
            // else {
            //     deferred.reject();
            // }

            // return promise
            return deferred.promise;
        }

        service.login = function (data) {

            return $$http.post('login', {
                email: data.email,
                password: data.password
            });
        }


        service.generateDocument = function(data){
            return $$http.postToDownload('document', data);
        };


        return service;
    }
})();
