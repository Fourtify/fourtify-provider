angular.module("slack", ["settings"])

.controller("SlackService", ["$scope", "SettingsService", "$uibModal",
    function ($scope, SettingsService, $uibModal) {
        var request = require("request")

        var url = $scope.settings.slack;
//will post to the default channel, aka "test"
        var data = {
            "username": "fourtify-bot",
            "text": "Hello world!",
            "icon_emoji": ":clock2:"
        };

        request({
            //url for the fourtify slack team
            url: url,
                //"https://hooks.slack.com/services/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",
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json"
            },
            body: data
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body)
            }
            else {

                console.log("error: " + error)
                console.log("response.statusCode: " + response.statusCode)
                console.log("response.statusText: " + response.statusText)
            }
        })
    }]  )


            .service('SlackService', [
                '$http',
                function ($http, $rootScope, $window) {
                    return {
                        updateSettings: function( updateObj, success, error) {
                            var req = {
                                method: 'PUT',
                                url: '/settings',
                                data: updateObj
                            };
                            this.apiCall(req, success, error);
                        },
                        getSettings: function(params, success, error) {
                            var req = {
                                method: 'GET',
                                url: '/settings',
                                params: params
                            };
                            this.apiCall(req, success, error);
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
