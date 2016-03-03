angular.module("employee", [])

    // =========================================================================
    // Employee Controllers ============================================================
    // =========================================================================
    .controller("EmployeeAllCtrl",[ "$scope", "EmployeeService", "$uibModal",
        function ($scope, EmployeeService, $uibModal) {


    }])

    .service('EmployeeService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                //Groups API
                getGroups: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/employee/groups',
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
