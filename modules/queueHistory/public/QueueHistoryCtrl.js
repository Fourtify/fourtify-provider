angular.module("queueHistory", [])
    // =========================================================================
    // QueueHistory History Controllers ============================================================
    // =========================================================================
    .controller("QueueHistoryAllCtrl",[ "$scope", "QueueHistoryService", "$uibModal",
        function ($scope, QueueHistoryService, $uibModal) {

            $scope.getQueueHistory = function(passBack){
                QueueHistoryService.getQueueHistory(
                    {
                        populate: "visitor,appointment"
                    },
                    //success function
                    function(data) {
                        $scope.queue = data;
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

            $scope.getQueueHistory();

            $scope.refresh = function(data) {
                clearTimeout($scope.activeRequest);
                $scope.activeRequest = setTimeout(function() {
                    $scope.getQueueHistory(data);
                }, 400);
            };


            $scope.update = function(updateObj) {
                $scope.clearMessages();

                var modalInstance = $uibModal.open({
                    templateUrl: '/templates/queue/history/update',
                    controller: 'QueueHistoryUpdateCtrl',
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
                    templateUrl: '/templates/queue/history/delete',
                    controller: 'QueueHistoryDeleteCtrl',
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


            $scope.clearMessages = function(){
                $scope.err = null;
                $scope.pending = null;
                $scope.success = null;
            }
        }])


    .controller("QueueHistoryUpdateCtrl", ["$scope", "$uibModalInstance", "updateObj", "QueueHistoryService",
        function ($scope, $uibModalInstance, updateObj, QueueHistoryService) {

            $scope.err = null;
            $scope.pending = {_msg:"Getting queue details..."};
            $scope.success = null;

            QueueHistoryService.getQueueHistory(
                {
                    id: updateObj._id,
                    populate: "visitor,appointment"
                },
                //success function
                function(data) {
                    $scope.clearMessages();
                    if(data._position){
                        $scope.position = data._position;
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
                    "visitor": updateObj._visitor._id,
                    "appointment": updateObj._appointment._id,
                    "position": $scope.position
                };

                $scope.pending = {_msg:"Updating QueueHistory..."};
                QueueHistoryService.updateQueueHistory(
                    updateObj._id,
                    obj,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"QueueHistory successfully updated!"},
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

    .controller("QueueHistoryDeleteCtrl", ["$scope", "$uibModalInstance", "delObj", "QueueHistoryService",
        function ($scope, $uibModalInstance, delObj, QueueHistoryService) {

            $scope.delObj = delObj;

            $scope.delete = function () {

                QueueHistoryService.deleteQueueHistory(
                    $scope.delObj._id,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"QueueHistory has been successfully deleted!"},
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

    .service('QueueHistoryService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                getQueueHistory: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/queue/history',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                updateQueueHistory: function(objId, obj, success, error) {
                    var req = {
                        method: 'PUT',
                        url: '/queue/history/'+objId,
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                deleteQueueHistory: function(delId, success, error) {
                    var req = {
                        method: 'DELETE',
                        url: '/queue/history/'+delId
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

