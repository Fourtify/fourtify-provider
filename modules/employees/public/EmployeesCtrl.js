angular.module("employees", [])
    // =========================================================================
    // Employees Controllers ===================================================
    // =========================================================================
    .controller("EmployeesAllCtrl",[ "$scope", "EmployeesService", "$uibModal",
        function ($scope, EmployeesService, $uibModal) {

            $scope.getEmployees = function(passBack){
                EmployeesService.getEmployees(
                    {},
                    //success function
                    function(data) {
                        $scope.employees = data;
                        if(passBack){
                            $scope.success = passBack.success;
                        }
                    },
                    //error function
                    function (data, status) {
                        $scope.clearMessages();
                        $scope.err = data;
                    }
                );
            };

            $scope.getEmployees();

            $scope.refresh = function(data) {
                clearTimeout($scope.activeRequest);
                $scope.activeRequest = setTimeout(function() {
                    $scope.getEmployees(data);
                }, 400);
            };

            $scope.create = function() {
                $scope.clearMessages();

                var modalInstance = $uibModal.open({
                    templateUrl: '/templates/employees/create',
                    controller: 'EmployeesCreateCtrl',
                    size: "md"
                });

                modalInstance.result.then(function (data) {
                    if (data.err) {
                        $scope.err = data.err;
                    }
                    else {
                        $scope.refresh(data);
                    }
                });
            };

            $scope.update = function(updateObj) {
                $scope.clearMessages();

                var modalInstance = $uibModal.open({
                    templateUrl: '/templates/employees/update',
                    controller: 'EmployeesUpdateCtrl',
                    size: "md",
                    resolve: {
                        updateObj: function() {
                            return updateObj;
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                    if (data.err) {
                        $scope.err = data.err;
                    }
                    else {
                        $scope.refresh(data);
                    }
                });
            };

            $scope.delete = function(delObj) {
                $scope.clearMessages();

                var modalInstance = $uibModal.open({
                    templateUrl: '/templates/employees/delete',
                    controller: 'EmployeesDeleteCtrl',
                    size: "md",
                    resolve: {
                        delObj: function () {
                            return delObj;
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                    if (data.err)
                    {
                        $scope.err = data.err;
                    }
                    else
                    {
                        $scope.refresh(data);
                    }
                });
            };



            $scope.setIdToRemove = function(q) {
                $scope.indexToRemove = q;
            };

            $scope.clearMessages = function(){
                $scope.err = null;
                $scope.pending = null;
                $scope.success = null;
            }
        }])

    .controller("EmployeesCreateCtrl", ["$scope", "$uibModalInstance", "EmployeesService",
        function ($scope, $uibModalInstance, EmployeesService) {

            $scope.err = null;
            $scope.pending =  null;
            $scope.success = null;

            $scope.create = function() {
                $scope.clearMessages();

                var obj = {
                    "name": {
                        "first": $scope.fname,
                        "last": $scope.lname
                    },
                    "email": $scope.email,
                    "phone": {
                        "type": "Business",
                        "number": $scope.phone
                    },
                    "title": $scope.title
                };

                $scope.pending = {_msg:"Creating Employee..."};
                EmployeesService.createEmployee(
                    obj,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Employee successfully created!"},
                            data: data
                        });
                    },
                    //error function
                    function(data, status) {
                        $scope.clearMessages();
                        $scope.err = data;
                    }
                );
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.clearMessages = function(){
                $scope.err = null;
                $scope.pending = null;
                $scope.success = null;
            }
        }])

    .controller("EmployeesUpdateCtrl", ["$scope", "$uibModalInstance", "updateObj", "EmployeesService",
        function ($scope, $uibModalInstance, updateObj, EmployeesService) {

            $scope.err = null;
            $scope.pending = {_msg:"Getting employee details..."};
            $scope.success = null;

            EmployeesService.getEmployees(
                {
                    id: updateObj._id
                },
                //success function
                function(data) {
                    $scope.clearMessages();
                    if(data._name && data._name._first){
                        $scope.fname = data._name._first;
                    }
                    if(data._name && data._name._last){
                        $scope.lname = data._name._last;
                    }
                    if(data._email){
                        $scope.email = data._email;
                    }
                    if(data._phone && data._phone._number){
                        $scope.phone = data._phone._number;
                    }
                    if(data._title){
                        $scope.title = data._title;
                    }
                },
                //error function
                function(data, status) {
                    $scope.clearMessages();
                    $scope.err = data;
                }
            );

            $scope.update = function() {

                $scope.clearMessages();

                var obj = {
                    "name": {
                        "first": $scope.fname,
                        "last": $scope.lname
                    },
                    "email": $scope.email,
                    "phone": {
                        "type": "Business",
                        "number": $scope.phone
                    },
                    "title": $scope.title
                };

                $scope.pending = {_msg:"Updating Employee..."};
                EmployeesService.updateEmployee(
                    updateObj._id,
                    obj,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Employee successfully updated!"},
                            data: data
                        });
                    },
                    //error function
                    function(data, status) {
                        $scope.clearMessages();
                        $scope.err = data;
                    }
                );
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.clearMessages = function(){
                $scope.err = null;
                $scope.pending = null;
                $scope.success = null;
            }
        }])

    .controller("EmployeesDeleteCtrl", ["$scope", "$uibModalInstance", "delObj", "EmployeesService",
        function ($scope, $uibModalInstance, delObj, EmployeesService) {

            $scope.delObj = delObj;

            $scope.delete = function () {

                EmployeesService.deleteEmployee(
                    $scope.delObj._id,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Employee has been successfully deleted!"},
                            data: data
                        });

                    },
                    //error function
                    function(data, status) {
                        $uibModalInstance.close({
                            err: data
                        });
                    }
                );
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }])

    .service('EmployeesService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                getEmployees: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/employees',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                createEmployee: function(obj, success, error) {
                    var req = {
                        method: 'POST',
                        url: '/employees',
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                updateEmployee: function(objId, obj, success, error) {
                    var req = {
                        method: 'PUT',
                        url: '/employees/'+objId+"/profile",
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                deleteEmployee: function(delId, success, error) {
                    var req = {
                        method: 'DELETE',
                        url: '/employees/'+delId
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


