angular.module("slack", [])

.controller("SlackCtrl", ["$scope", "SlackService", "$uibModal", "$http",
    function ($scope, SlackService, $uibModal, $http) {

//will post to the default channel, aka "test"


        SlackService.getSettings(
            {},
            //success function
            function(data) {

                SlackService.sendNotification(
                    {
                        url: data._slack
                    },
                    //success function
                    function(data) {

                        console.log(data);
                    },
                    //error function
                    function(data, status) {

                        $scope.err = data;
                        console.log(data);
                    }
                );
            },
            //error function
            function(data, status) {

                $scope.err = data;
                console.log(data);
            }
        );

    }]  )


            .service('SlackService', [
                '$http',
                function ($http, $rootScope, $window) {
                    return {
                        getSettings: function(params, success, error) {
                            var req = {
                                method: 'GET',
                                url: '/settings',
                                params: params
                            };
                            this.apiCall(req, success, error);
                        },
                        sendNotification: function(data, success, error) {
                            var req = {
                                method: 'POST',
                                url: '/api/slack',
                                data: data
                            };
                            $http(req).success(function(data) {
                                success(data);
                            }).error(function(data, status) {
                                error(data, status);
                            });
                        },
                        apiCall: function(req, success, error) {
                            req.headers = {url: req.url};
                            req.url = "/api";
                            $http(req).success(function(data) {
                                success(data);
                            }).error(function(data, status) {
                                error(data, status);
                            });
                        }
                    };
                }]);
