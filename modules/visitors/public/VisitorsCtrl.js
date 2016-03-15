angular.module("visitors", [])
    // =========================================================================
    // Visitors Controllers ============================================================
    // =========================================================================
    .controller("VisitorsAllCtrl",[ "$scope", "VisitorsService", "$uibModal",
        function ($scope, VisitorsService, $uibModal) {

            $scope.getVisitors = function(passBack){
                VisitorsService.getVisitors(
                    {},
                    //success function
                    function(data) {
                        $scope.visitors = data;
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

            $scope.getVisitors();

            $scope.refresh = function(data) {
                clearTimeout($scope.activeRequest);
                $scope.activeRequest = setTimeout(function() {
                    $scope.getVisitors(data);
                }, 400);
            };

            $scope.create = function() {
                $scope.clearMessages();

                var modalInstance = $uibModal.open({
                    templateUrl: '/templates/visitors/create',
                    controller: 'VisitorsCreateCtrl',
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
                    templateUrl: '/templates/visitors/update',
                    controller: 'VisitorsUpdateCtrl',
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
                    templateUrl: '/templates/visitors/delete',
                    controller: 'VisitorsDeleteCtrl',
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

    .controller("VisitorsCreateCtrl", ["$scope", "$uibModalInstance", "VisitorsService",
        function ($scope, $uibModalInstance, VisitorsService) {

            $scope.err = null;
            $scope.pending =  null;
            $scope.success = null;

            $scope.statusOpt = [
                {name:'Active', value:'active'},
                {name:'Inactive', value:'inactive'}
            ];
            $scope.status = $scope.statusOpt[0];

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
                    "status": $scope.status.value
                };

                $scope.pending = {_msg:"Creating Visitor..."};
                VisitorsService.createVisitor(
                    obj,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Visitor successfully created!"},
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

    .controller("VisitorsUpdateCtrl", ["$scope", "$uibModalInstance", "updateObj", "VisitorsService",
        function ($scope, $uibModalInstance, updateObj, VisitorsService) {

            $scope.err = null;
            $scope.pending = {_msg:"Getting visitor details..."};
            $scope.success = null;

            $scope.statusOpt = [
                {name:'Active', value:'active'},
                {name:'Inactive', value:'inactive'}
            ];
            $scope.status = $scope.statusOpt[0];

            VisitorsService.getVisitors(
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
                    if(data._status){
                        var statusPos = $scope.statusOpt.map(function(e) { return e.value; }).indexOf(data._status);
                        $scope.status = $scope.statusOpt[statusPos];
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
                    "status": $scope.status.value
                };

                $scope.pending = {_msg:"Updating Visitor..."};
                VisitorsService.updateVisitor(
                    updateObj._id,
                    obj,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Visitor successfully updated!"},
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

    .controller("VisitorsDeleteCtrl", ["$scope", "$uibModalInstance", "delObj", "VisitorsService",
        function ($scope, $uibModalInstance, delObj, VisitorsService) {

            $scope.delObj = delObj;

            $scope.delete = function () {

                VisitorsService.deleteVisitor(
                    $scope.delObj._id,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Visitor has been successfully deleted!"},
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

    .service('VisitorsService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                getVisitors: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/visitors',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                createVisitor: function(obj, success, error) {
                    var req = {
                        method: 'POST',
                        url: '/visitors',
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                updateVisitor: function(objId, obj, success, error) {
                    var req = {
                        method: 'PUT',
                        url: '/visitors/'+objId,
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                deleteVisitor: function(delId, success, error) {
                    var req = {
                        method: 'DELETE',
                        url: '/visitors/'+delId
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


