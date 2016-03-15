angular.module("appointments", [])


    // =========================================================================
    // Appointments Controllers ============================================================
    // =========================================================================
    .controller("AppointmentsAllCtrl",[ "$scope", "AppointmentsService", "$uibModal",
        function ($scope, AppointmentsService, $uibModal) {

            $scope.getAppointments = function(passBack){
                AppointmentsService.getAppointments(
                    {
                        populate: "visitor"
                    },
                    //success function
                    function(data) {
                        $scope.appointments = data;
                        $scope.appointments.map(function(e){
                            if(e._start){
                                e._start = moment(e._start).format('lll');
                            }
                            if(e._end){
                                e._end = moment(e._end).format('lll');
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

            $scope.getAppointments();

            $scope.refresh = function(data) {
                clearTimeout($scope.activeRequest);
                $scope.activeRequest = setTimeout(function() {
                    $scope.getAppointments(data);
                }, 400);
            };

            $scope.create = function() {
                $scope.clearMessages();

                var modalInstance = $uibModal.open({
                    templateUrl: '/templates/appointments/create',
                    controller: 'AppointmentsCreateCtrl',
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
                    templateUrl: '/templates/appointments/update',
                    controller: 'AppointmentsUpdateCtrl',
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
                    templateUrl: '/templates/appointments/delete',
                    controller: 'AppointmentsDeleteCtrl',
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


            /**
             * Scope function to be called to add/create appointment and add it to database
             */
            $scope.submitCreate = function(){


                //console.log("in datapicker:" +JSON.stringify($('#datetimepicker4').data("DateTimePicker").date()));

                var startTime = moment($('#datetimepicker4').data("DateTimePicker").date())
                var endTime = moment($('#datetimepicker4').data("DateTimePicker").date()).add(1, 'hours');      //End time 1 hour later by default

                console.log("start:" +moment(startTime).format('lll'));
                console.log("end :" +moment(endTime).format('lll'));

                AppointmentsService.createAppointment(
                    {
                        visitor: $scope.visitor,
                        start: startTime,
                        end: endTime,
                        reason: $scope.reason
                    },
                    //success function
                    function(data) {
                        console.log("in success:" +JSON.stringify($('#datetimepicker4').data("DateTimePicker").date()));
                        //$scope.clearMessages();
                        $scope.success = "YAY";
                    },
                    //error function
                    function(data, status) {
                        //$scope.clearMessages();
                        $scope.err = data;
                    }
                );

                /* //old code
                $scope.appointments.push({
                    visitor: $scope.visitor,
                    start: $scope.start,
                    end: $scope.end,
                    status: $scope.status
                });
                $scope.visitor="";
                $scope.start="";
                $scope.end="";
                $scope.status="";
                jQuery('#myModal').modal('hide');
                */
            };


            $scope.submitDelete = function(){

                console.log("in delete :" +$scope.indexToRemove);

                AppointmentsService.deleteAppointment(
                    {
                        appointmentId: $scope.indexToRemove
                    },
                    //success function
                    function(data) {
                        //console.log("in success:" +JSON.stringify($('#datetimepicker4').data("DateTimePicker").date()));
                        //$scope.clearMessages();
                        var indexOfAppointment =  findIndexOfObject($scope.appointments, $scope.indexToRemove);
                        $scope.appointments.splice(indexOfAppointment, 1);
                        $scope.success = "YAY";
                    },
                    //error function
                    function(data, status) {
                        //$scope.clearMessages();
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

    .controller("AppointmentsCreateCtrl", ["$scope", "$uibModalInstance", "AppointmentsService", "$http",
        function ($scope, $uibModalInstance, AppointmentsService, $http) {

            $scope.err = null;
            $scope.pending =  null;
            $scope.success = null;

            $scope.start = "2016-03-15T09:12:00.000Z";
            $scope.end = "2016-03-15T10:12:00.000Z";

            $scope.statusOpt = [
                {name:'Active', value:'active'},
                {name:'Inactive', value:'inactive'}
            ];
            $scope.status = $scope.statusOpt[0];

            /*$scope.searchVisitor = function(str) {
                $scope.search = str;
                clearTimeout($scope.activeRequest);
                $scope.activeRequest = setTimeout(function() {
                    AppointmentsService.getVisitors(
                        {
                            search: $scope.search
                        },
                        //success function
                        function(data) {
                            $scope.visitorsList = data;
                        },
                        //error function
                        function (data, status) {
                            $scope.clearMessages();
                            $scope.err = data;
                        }
                    );
                }, 400);
            };*/

            $scope.searchVisitor = function(val) {
                var req = {
                    method: 'GET',
                    url: '/visitors',
                    params: {
                        search: val
                    }
                };
                req.headers = {url: req.url};
                req.url = "/api";

                return $http(req).then(function(response){
                    return response.data.map(function(item){
                        item.display = "";
                        if(item._name && item._name._first){
                            item.display += item._name._first;
                        }
                        if(item._name && item._name._last){
                            item.display = item.display + " " + item._name._last;
                        }
                        if(item._email){
                            item.display = item.display + " - " + item._email;
                        }
                        return item;
                    });
                });
            };

            $scope.create = function() {
                $scope.clearMessages();

                var obj = {
                    "visitor": $scope.visitor._id,
                    "start": $scope.start,
                    "end": $scope.end,
                    "reason": $scope.reason,
                    "status": $scope.status.value
                };

                $scope.pending = {_msg:"Creating Visitor..."};
                AppointmentsService.createAppointment(
                    obj,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Appointment successfully created!"},
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

    .controller("AppointmentsUpdateCtrl", ["$scope", "$uibModalInstance", "updateObj", "AppointmentsService",
        function ($scope, $uibModalInstance, updateObj, AppointmentsService) {

            $scope.err = null;
            $scope.pending = {_msg:"Getting appointment details..."};
            $scope.success = null;

            $scope.statusOpt = [
                {name:'Active', value:'active'},
                {name:'Inactive', value:'inactive'}
            ];
            $scope.status = $scope.statusOpt[0];

            AppointmentsService.getAppointments(
                {
                    id: updateObj._id,
                    populate: "visitor"
                },
                //success function
                function(data) {
                    $scope.clearMessages();
                    if(data._visitor){
                        $scope.visitor = data._visitor;
                        $scope.visitor.display = "";
                        if(data._visitor._name && data._visitor._name._first){
                            $scope.visitor.display += data._visitor._name._first;
                        }
                        if(data._visitor._name && data._visitor._name._last){
                            $scope.visitor.display = $scope.visitor.display + " " + data._visitor._name._last;
                        }
                        if(data._visitor._email){
                            $scope.visitor.display = $scope.visitor.display + " - " + data._visitor._email;
                        }
                    }
                    if(data._start){
                        $scope.start = data._start;
                    }
                    if(data._end){
                        $scope.end = data._end;
                    }
                    if(data._reason){
                        $scope.reason = data._reason;
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

            $scope.searchVisitor = function(val) {
                var req = {
                    method: 'GET',
                    url: '/visitors',
                    params: {
                        search: val
                    }
                };
                req.headers = {url: req.url};
                req.url = "/api";

                return $http(req).then(function(response){
                    return response.data.map(function(item){
                        item.display = "";
                        if(item._name && item._name._first){
                            item.display += item._name._first;
                        }
                        if(item._name && item._name._last){
                            item.display = item.display + " " + item._name._last;
                        }
                        if(item._email){
                            item.display = item.display + " - " + item._email;
                        }
                        return item;
                    });
                });
            };

            $scope.update = function() {

                $scope.clearMessages();

                var obj = {
                    "visitor": $scope.visitor._id,
                    "start": $scope.start,
                    "end": $scope.end,
                    "reason": $scope.reason,
                    "status": $scope.status.value
                };

                $scope.pending = {_msg:"Updating Appointment..."};
                AppointmentsService.updateAppointment(
                    updateObj._id,
                    obj,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Appointment successfully updated!"},
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

    .controller("AppointmentsDeleteCtrl", ["$scope", "$uibModalInstance", "delObj", "AppointmentsService",
        function ($scope, $uibModalInstance, delObj, AppointmentsService) {

            $scope.delObj = delObj;

            $scope.delete = function () {

                AppointmentsService.deleteAppointment(
                    $scope.delObj._id,
                    //success function
                    function(data) {
                        $uibModalInstance.close({
                            success: {_msg:"Appointment has been successfully deleted!"},
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

    .service('AppointmentsService', [
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
                getAppointments: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/appointments',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                createAppointment: function(obj, success, error) {
                    var req = {
                        method: 'POST',
                        url: '/appointments',
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                updateAppointment: function(objId, obj, success, error) {
                    var req = {
                        method: 'PUT',
                        url: '/appointments/'+objId,
                        data: obj
                    };
                    this.apiCall(req, success, error);
                },
                deleteAppointment: function(delId, success, error) {
                    var req = {
                        method: 'DELETE',
                        url: '/appointments/'+delId
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

