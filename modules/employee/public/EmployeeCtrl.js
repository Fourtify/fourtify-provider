angular.module("employee", [])

    // =========================================================================
    // Employee Controllers ============================================================
    // =========================================================================
    .controller("EmployeeAllCtrl",[ "$scope", "EmployeeService", "$uibModal",
        function ($scope, $modal, EmployeeService, $uibModal) {

            $scope.employeeList = [];

            $scope.createEmployee = function(){
                $scope.employeeList.push({
                    name: $scope.name,
                    title: $scope.title,
                    email: $scope.email,
                    phoneNumber: $scope.phoneNumber,
                });
                $scope.name="";
                $scope.title="";
                $scope.email="";
                $scope.phoneNumber="";
                jQuery('#myModal').modal('hide');
            };
            $scope.newField = {};
            $scope.editing = false;
            $scope.displayedCollection = [].concat($scope.employeeList);

            $scope.editRowCollection = function(q) {
                $scope.editing = $scope.employeeList.indexOf(q);
                $scope.newField = angular.copy(q);
            };

            /* This function allows employees to be removed from the Employees
             dashboard inside fourtify-provider. */
            $scope.removeEmployee = function(q) {
                var indexOfEmployee =  findIndexOfObject($scope.employeeList, q);
                $scope.employeeList.splice(indexOfEmployee, 1);
            }
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

    /* Finds the index of an object inside the array representing
     the employee.
     */
    function findIndexOfObject(arrayToSearch, keyToFind) {
        for (var i = 0; i < arrayToSearch.length; i++) {
            if (arrayToSearch[i] == keyToFind) {
                return i;
            }
        }
        return null;
    }