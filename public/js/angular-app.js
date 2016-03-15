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
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/templates/dashboard"
                /*controller: "QueueAllCtrl",
                resolve: {
                    queue: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "queue",
                                files: ["/pub/engine/QueueCtrl.js"]
                            }
                        );
                    }
                }*/
            })

            // Visitors
            .state('visitors', {
                url: "/visitors",
                templateUrl: "/templates/visitors",
                controller: "VisitorsAllCtrl",
                resolve: {
                    visitors: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "visitors",
                                files: ["/pub/visitors/VisitorsCtrl.js"]
                            }
                        );
                    }
                }
            })

            // Employees
            .state('employees', {
                url: "/employees",
                templateUrl: "/templates/employees",
                controller: "EmployeesAllCtrl",
                resolve: {
                    employees: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "employees",
                                files: ["/pub/employees/EmployeesCtrl.js"]
                            }
                        );
                    }
                }
            })

            // Appointments
            .state('appointments', {
                url: "/appointments",
                templateUrl: "/templates/appointments",
                controller: "AppointmentsAllCtrl",
                resolve: {
                    appointments: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "appointments",
                                files: ["/pub/appointments/AppointmentsCtrl.js"]
                            }
                        );
                    }
                }
            })


            // Visitor History
            .state('queueHistory', {
                url: "/queueHistory",
                templateUrl: "/templates/queueHistory",
                controller: "QHAllCtrl",
                resolve: {
                    staff: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "queueHistory",
                                files: ["/pub/queueHistory/QHCtrl.js"]
                            }
                        );
                    }
                }
            })


            // Forms
            .state('forms', {
                url: "/forms",
                templateUrl: "/templates/forms",
                controller: "FormsAllCtrl",
                resolve: {
                    staff: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "forms",
                                files: ["/pub/forms/FormsCtrl.js"]
                            }
                        );
                    }
                }
            })


            // Settings
            .state('settings', {
                url: "/settings",
                templateUrl: "/templates/settings",
                controller: "SettingsAllCtrl",
                resolve: {
                    staff: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "settings",
                                files: ["/pub/settings/SettingsCtrl.js"]
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
