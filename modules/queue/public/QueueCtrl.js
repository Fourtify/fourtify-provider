angular.module("queue", [])
    // =========================================================================
    // Queue Controllers ============================================================
    // =========================================================================
    .controller("QueueAllCtrl",[ "$scope", "QueueService", "$uibModal",
        function ($scope, QueueService, $uibModal) {

            $scope.getQueue = function(passBack){
                QueueService.getQueue(
                    {
                        populate: "visitor,appointment"
                    },
                    //success function
                    function(data) {
                        $scope.queue = data;
                        $scope.queue.map(function(e){
                            if(e._appointment && e._appointment._start){
                                e._appointment._start = moment(e._appointment._start).format('lll');
                            }
                            if(e._appointment && e._appointment._end){
                                e._appointment._end = moment(e._appointment._end).format('lll');
                            }
                        });
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

            $scope.getQueue();

            $scope.refresh = function(data) {
                clearTimeout($scope.activeRequest);
                $scope.activeRequest = setTimeout(function() {
                    $scope.getQueue(data);
                }, 400);
            };

            $scope.create = function() {
                $scope.clearMessages();

                var modalInstance = $uibModal.open({
                    templateUrl: '/templates/queue/create',
                    controller: 'QueueCreateCtrl',
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
                    templateUrl: '/templates/queue/update',
                    controller: 'QueueUpdateCtrl',
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

            $scope.reorder = function() {

                $scope.pending = {_msg:"Reordering Queue..."};

                for (var i = 0; i < $scope.queue.length; ++i) {

                    var obj = {
                        "visitor": $scope.queue[i]._visitor._id,
                        "appointment": $scope.queue[i]._appointment._id,
                        "position": $scope.queue[i]._position = i+1
                    };

                    QueueService.updateQueue(
                        $scope.queue[i]._visitor._id,
                        obj,
                        //success
                        function(data) {
                            $scope.refresh({
                                success: {_msg:"Scope has been reordered!"}
                            });
                        },
                        //error function
                        function(data, status) {
                            $scope.clearMessages();
                            $scope.err = data;
                        }
                    );

                }
            };

            $scope.moveUp = function(moveUpObj) {

                var obj = {
                    "visitor": moveUpObj._visitor._id,
                    "appointment": moveUpObj._appointment._id,
                    "position": Number(moveUpObj._position) - 1
                };

                $scope.pending = {_msg:"Updating Queue..."};
                QueueService.updateQueue(
                    moveUpObj._id,
                    obj,
                    //success
                    function(data) {
                        $scope.refresh({
                            success: {_msg:moveUpObj._visitor._email+" has been moved up!"}
                        });
                    },
                    //error function
                    function(data, status) {
                        $scope.clearMessages();
                        $scope.err = data;
                    }
                );
            };

            $scope.moveDown = function(moveDownObj) {

                var obj = {
                    "visitor": moveDownObj._visitor._id,
                    "appointment": moveDownObj._appointment._id,
                    "position": Number(moveDownObj._position) + 1
                };

                $scope.pending = {_msg:"Updating Queue..."};
                QueueService.updateQueue(
                    moveDownObj._id,
                    obj,
                    //success
                    function(data) {
                        $scope.refresh({
                            success: {_msg:moveDownObj._visitor._email+" has been moved down!"}
                        });
                    },
                    //error function
                    function(data, status) {
                        $scope.clearMessages();
                        $scope.err = data;
                    }
                );
            };

            $scope.delete = function(delObj) {
                $scope.clearMessages();

                var modalInstance = $uibModal.open({
                    templateUrl: '/templates/queue/delete',
                    controller: 'QueueDeleteCtrl',
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

            $scope.checkIn = function(queue) {
                $scope.clearMessages();
                var payload = queue._visitor._name._first + " " + queue._visitor._name._last + " has checked in for appointment";//+ moment().format("MM/DD/YYYY hh:mm:ss");
                var obj = {
                    "visitor": queue._visitor._id,
                    "appointment": queue._appointment._id,
                    "queue": queue._id,
                    "payload": payload
                };
                console.log(queue._appointment);
                QueueService.getSettings(
                    {},
                    //success function
                    function(data) {
                        //$scope.clearMessages();
                        QueueService.sendNotification(
                            {
                                url: data._slack,
                                payload: payload
                            },
                            //success function
                            function(data) {
                                //$scope.clearMessages();
                                console.log(data);
                            },
                            //error function
                            function(data, status) {
                                //$scope.clearMessages();
                                $scope.err = data;
                                console.log(data);
                            }
                        );
                    },
                    //error function
                    function(data, status) {
                        //$scope.clearMessages();
                        $scope.err = data;
                        console.log(data);
                    }
                );


                QueueService.createQueueHistory(
                    obj,
                    //success function
                    function(data) {
                        $scope.refresh({
                            success: {_msg:queue._visitor._email+" has been successfully checked in!"}
                        });
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

    .controller("QueueCreateCtrl", ["$scope", "$uibModalInstance", "QueueService", "$http",
        function ($scope, $uibModalInstance, QueueService, $http) {

            $scope.err = null;
            $scope.pending =  null;
            $scope.success = null;

            $scope.searchAppointments = function(val) {
                var req = {
                    method: 'GET',
                    url: '/appointments',
                    params: {
                        populate: "visitor"
                    }
                };
                req.headers = {url: req.url};
                req.url = "/api";

                return $http(req).then(function(response){
                    return response.data.map(function(item){
                        item.display = "";
                        if(item._visitor._name && item._visitor._name._first){
                            item.display += item._visitor._name._first;
                        }
                        if(item._visitor._name && item._visitor._name._last){
                            item.display = item.display + " " + item._visitor._name._last;
                        }
                        if(item._visitor._email){
                            item.display = item.display + " - " + item._visitor._email;
                        }
                        if(item._start){
                            item.display = item.display + " - " + moment(item._start).format('lll');;
                        }
                        return item;
                    });
                });
            };

            $scope.create = function() {
                $scope.clearMessages();

                var obj = {
                    "visitor": $scope.appointment._visitor._id,
                    "appointment": $scope.appointment._id,
                    "position": $scope.position
                };

                $scope.pending = {_msg:"Adding to Queue..."};
                QueueService.createQueue(
                    obj,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Successfully added to queue"}
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

    .controller("QueueUpdateCtrl", ["$scope", "$uibModalInstance", "updateObj", "QueueService",
        function ($scope, $uibModalInstance, updateObj, QueueService) {

            $scope.err = null;
            $scope.pending = {_msg:"Getting queue details..."};
            $scope.success = null;

            QueueService.getQueue(
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

                $scope.pending = {_msg:"Updating Queue..."};
                QueueService.updateQueue(
                    updateObj._id,
                    obj,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Queue successfully updated!"},
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

    .controller("QueueDeleteCtrl", ["$scope", "$uibModalInstance", "delObj", "QueueService",
        function ($scope, $uibModalInstance, delObj, QueueService) {

            $scope.delObj = delObj;

            $scope.delete = function () {

                QueueService.deleteQueue(
                    $scope.delObj._id,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Queue has been successfully deleted!"},
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

    .service('QueueService', [
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
                getQueue: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/queue',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                createQueue: function(obj, success, error) {
                    var req = {
                        method: 'POST',
                        url: '/queue',
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                createQueueHistory: function(obj, success, error) {
                    var req = {
                        method: 'POST',
                        url: '/queue/history',
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                updateQueue: function(objId, obj, success, error) {
                    var req = {
                        method: 'PUT',
                        url: '/queue/'+objId,
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                deleteQueue: function(delId, success, error) {
                    var req = {
                        method: 'DELETE',
                        url: '/queue/'+delId
                    };
                    this.apiCall(req, success, error);
                },
                sendNotification: function(data, success, error) {
                    var req = {
                        method: 'POST',
                        url: '/api/slack',
                        data: data
                    };
                    $http(req).success(function(data) {
                        success(data);
                    }).error(function(data, status) {
                        error(data, status);
                    });
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

