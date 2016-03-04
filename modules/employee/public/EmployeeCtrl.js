angular.module("employee", [])

    // =========================================================================
    // Employee Controllers ============================================================
    // =========================================================================
    .controller("EmployeeAllCtrl",[ "$scope", "EmployeeService", "$uibModal",
        function ($scope, $modal, EmployeeService, $uibModal) {


            $scope.users =[{"name":"Natalie Portman"},{"name":"Ryan Gosling"},{"name":"Matt Damon"},{"name":"Will Ferrell"}];

            $scope.addNew = function(user){
                $scope.users.push(user);
                $scope.current = {};
            };

            $scope.current = {};


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
