angular.module("settings", [])

    // =========================================================================
    // Visitors Controllers ============================================================
    // =========================================================================
    .controller("SettingsAllCtrl",[ "$scope", "SettingsService", "$uibModal",
        function ($scope, SettingsService, $uibModal) {

            $scope.settings = {};
            $scope.settings.theme = {};

            SettingsService.getSettings(
                {},
                //success function
                function(data) {
                    $scope.clearMessages();
                    if(data._logo){
                        $scope.settings.logo = data._logo;
                    }
                    if(data._slack){
                        $scope.settings.slack = data._slack;
                    }
                    if(data._timezone){
                        $scope.settings.timezone = data._timezone;
                    }
                    if(data._theme){
                        $scope.settings.theme = data._theme;
                    }
                },
                //error function
                function(data, status) {
                    $scope.clearMessages();
                    $scope.err = data;
                }
            );
            $scope.update = function() {
                SettingsService.updateSettings(
                    {
                        timezone: $scope.settings.timezone,
                        logo: $scope.settings.logo,
                        theme: $scope.settings.theme,
                        slack: $scope.settings.slack
                    },
                    //success function
                    function(data) {
                        $scope.clearMessages();
                        $scope.success = "YAY";
                    },
                    //error function
                    function(data, status) {
                        $scope.clearMessages();
                        $scope.err = data;
                    }
                );
            };
            $scope.clearMessages = function(){
                $scope.err = null;
                $scope.pending = null;
                $scope.success = null;
            }

        }])

    .service('SettingsService', [
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
        }
    ]);
