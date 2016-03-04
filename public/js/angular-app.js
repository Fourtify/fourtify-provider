// public/js/angular-app.js
angular.module("fourtifyApp",
    [
        "ui.router",
        "oc.lazyLoad",
        "ui.bootstrap",
        "ngFileUpload",
        "angular-loading-bar"
    ])
    .config(function ($stateProvider, $locationProvider, $httpProvider) {

        // Set Global HTTP Headers
        // Initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // Extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        $stateProvider

            // Dashboard states
            .state('/', {
                url: "/",
                controller: function($state){
                    $state.go('dashboard');
                }
            })
            /*.state('dashboard', {
                url: "/dashboard",
                templateUrl: "/templates/dashboard"
            })*/

            // Employee
            .state('employee', {
                url: "/employee",
                templateUrl: "/templates/employee",
                controller: "EmployeeAllCtrl",
                resolve: {
                    staff: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "staff",
                                files: ["/pub/employee/EmployeeCtrl.js"]
                            }
                        );
                    }
                }
            })

            // Appointments
            .state('appointments', {
                url: "/appointments",
                templateUrl: "/templates/appointments",
                controller: "ApptAllCtrl",
                resolve: {
                    staff: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "appointments",
                                files: ["/pub/appointments/ApptCtrl.js"]
                            }
                        );
                    }
                }
            })

        $locationProvider.html5Mode(true);

    })

    .controller("AppCtrl", function ($state, $http, $rootScope, $scope, AppService) {

        //do something

    })

    .service('AppService', [
        '$http',
        function($http) {
            return {
                getGlobalSettings: function(success, error) {
                    var req = {
                        method: 'GET',
                        url: '/settings/public',
                        params: {
                            module: 'global'
                        }
                    };
                    this.apiCall(req, success, error);
                },
                myself: function(success, error) {
                    var req = {
                        method: 'GET',
                        url: '/api/myself'
                    };
                    this.apiCall(req, success, error);
                },
                apiCall: function(req, success, error){
                    $http(req).success(function(data){
                        success(data);
                    }).error(function(data, status){
                        if(status == 401){
                            return $window.location.href = "/login?redirectUrl="+$location.path();
                        }
                        else{
                            error(data, status);
                        }
                    });
                }
            };
        }
    ]);
