angular.module("settings", [])

    // =========================================================================
    // Visitors Controllers ============================================================
    // =========================================================================
    .controller("SettingsAllCtrl",[ "$scope", "SettingsService", "$uibModal",
        function ($scope, SettingsService, $uibModal) {


        }])

    .service('SettingsService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                //Groups API
                getGroups: function(params, success, error) {
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
        }
    ]);
