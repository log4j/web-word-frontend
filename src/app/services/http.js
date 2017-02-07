(function () {
    'use strict';

    angular
        .module('app.http', [])
        .config(function ($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .factory('$$http', function (API_CONFIG, $http) {

            var $$http = this;

            var commonResponseHandler = function (res) {
                if (res.status >= 200 && res.status < 400 && res.data) {
                    if (res.data.result == false) {
                        return { result: false, err: res.data.err }
                    }
                    else if (res.data.result == true) {
                        return res.data;
                    }

                    if (res.data.success == false) {
                        return { result: false, err: res.data };
                    }

                    if (res.data.success == true) {
                        return { result: true, data: res.data };
                    }

                    return { result: true, data: res.data };
                } else {
                    return { result: false };
                }
            };
            var errResponseHandler = function (res) {
                return {
                    result: false,
                    err: 'Server error:' + res.status
                };
            };


            $$http.get = function (action, paraData, options) {
                var url = ((options && options.endPoint) ? options.endPoint : API_CONFIG.host) + "/" + action;
                url = url.replace(/\/(\/)*/gi, "\/").replace(/:\//gi, ":\/\/");
                if (paraData) {
                    var suffix = "";
                    for (var key in paraData) {
                        suffix += ((suffix === "") ? "?" : "&") + key + "=" + paraData[key];
                    }
                    url += suffix;
                }
                return $http.get(url, options).then(commonResponseHandler, errResponseHandler);
            };

            $$http.post = function (action, postData, options) {

                // console.log((API_CONFIG.host + "/" + action).replace(/\/\//gi, "\/").replace(/:\//gi,":\/\/"));

                return $http.post((((options && options.endPoint) ? options.endPoint : API_CONFIG.host) + "/" + action).replace(/\/(\/)*/gi, "\/").replace(/:\//gi, ":\/\/"), postData, options).then(commonResponseHandler, errResponseHandler);
            }

            $$http.put = function (action, postData, options) {

                // console.log((API_CONFIG.host + "/" + action).replace(/\/(\/)*/gi, "\/").replace(/:\//gi,":\/\/"));

                return $http.put((((options && options.endPoint) ? options.endPoint : API_CONFIG.host) + "/" + action).replace(/\/(\/)*/gi, "\/").replace(/:\//gi, ":\/\/"), postData, options).then(commonResponseHandler, errResponseHandler);
            }

            $$http.delete = function (action, postData, options) {
                return $http.delete((((options && options.endPoint) ? options.endPoint : API_CONFIG.host) + "/" + action).replace(/\/(\/)*/gi, "\/").replace(/:\//gi, ":\/\/"), { data: postData }).then(commonResponseHandler, errResponseHandler);
            }

            $$http.postMultipartFormData = function (action, postData, options) {
                var data = new FormData();
                for (var i = 0; i < postData.length; i++) {
                    data.append(postData[i].key, postData[i].value);
                }
                return $http.post((((options && options.endPoint) ? options.endPoint : API_CONFIG.host) + "/" + action).replace(/\/(\/)*/gi, "\/").replace(/:\//gi, ":\/\/"), data, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(commonResponseHandler, errResponseHandler);
            }

            $$http.postToDownload = function (action, postData, options) {
                console.log(action);
                return $http.post(
                    (((options && options.endPoint) ? options.endPoint : API_CONFIG.host) + "/" + action).replace(/\/(\/)*/gi, "\/").replace(/:\//gi, ":\/\/"),
                    postData,
                    { responseType: 'arraybuffer' }
                ).then(function (response) {

                    var header = response.headers('Content-Disposition');
                    var fileName = 'test.docx';
                    if(header && header.indexOf('filename=')>=0){
                        fileName = header.substring(header.indexOf('filename=')+9);
                    }
                    var blob = new Blob(
                        [response.data],
                        {
                            type: response.headers('Content-Type')
                        });

                    console.log(response);

                    if (window.navigator.msSaveOrOpenBlob) { // For IE:
                        navigator.msSaveBlob(blob, fileName);
                    } else { // For other browsers:
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = fileName;
                        link.click();
                        window.URL.revokeObjectURL(link.href);
                    }

                    return { result: true };
                    // this.save();
                },
                    function (response) {
                        console.log(response);
                    });

            }

            return $$http;

        })
        /**
         * service for track user session,
         * if user has no action for 10 minutes, pop up a modal to ask them if they need more time
         */
        .service('ServiceInterceptor', function () {
            var service = this;

            /**
             * intercept the response,
             * once a request is finished, we update the last call date
             * @param config
             * @returns {*}
             */
            service.response = function (config) {
                // var currentUser = UserService.getCurrentUser(),
                //     access_token = currentUser ? currentUser.access_token : null;
                //
                // if (access_token) {
                //     config.headers.authorization = access_token;
                // }

                // console.log('get response', config);

                //console.log(service.getLastTime());


                service.lastCall = new Date();


                return config;
            };


            service.responseError = function (response) {
                // if (response.status === 401) {
                //     $rootScope.$broadcast('unauthorized');
                // }
                // console.log(service.getLastTime());


                return response;
            };

            /**
             * calculate when the last call received
             * @returns {number}
             */
            service.getLastTime = function () {
                if (service.lastCall)
                    return ((new Date()).getTime() - service.lastCall.getTime());
                else
                    return 1000 * 60 * 30;
            };

            /**
             * update the last call time manually
             */
            service.keepMeIn = function () {
                //TODO: we should send a call to backend service to make sure that the session will keep alive in backend while we manually extends the session time on front end.
                service.lastCall = new Date();
            };

            return service;

        });
})();