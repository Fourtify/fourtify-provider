angular.module("appointments", [])


    // =========================================================================
    // Appointments Controllers ============================================================
    // =========================================================================
    .controller("ApptAllCtrl",[ "$scope", "AppointmentsService", "$uibModal",
        function ($scope, AppointmentsService, $uibModal) {

            $scope.appointments = [];
            //$('#sandbox-container .input-daterange').datepicker({});
            //$('.datepicker').datepicker();

            /**
             * Initial call to retrieve appointments as UI loads
             *
             */
            AppointmentsService.getAppointments(
                {},
                //success function
                function(data) {
                    $scope.clearMessages();
                    //console.log("data "+i+": "+JSON.stringify(data));
                    for(var i = 0; i < data.length; i++){
                        var appt = {};

                        appt.id = data[i]._id;
                        if(data[i]._visitor._id){       //Need first last name
                            appt.visitor = data[i]._visitor._id;
                        }
                        if(data[i]._start){
                            appt.start = moment(data[i]._start).format('lll');
                        }
                        if(data[i]._end){
                            appt.end = moment(data[i]._end).format('lll');
                        }
                        if(data[i]._reason){
                            appt.reason = data[i]._reason;
                        }
                        console.log("reason "+i+": "+data[i]._reason);
                        if(data[i]._status){
                            appt.status = data[i]._status;
                        }
                        $scope.appointments.push(appt);
                    }
                },
                //error function
                function (data, status) {
                    $scope.clearMessages();
                    $scope.err = data;
                }
            );


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


            $scope.submitDelete = function(q){

                console.log("in delete :" +q);

                AppointmentsService.deleteAppointment(
                    {
                        appointmentId: q
                    },
                    //success function
                    function(data) {
                        //console.log("in success:" +JSON.stringify($('#datetimepicker4').data("DateTimePicker").date()));
                        //$scope.clearMessages();
                        var indexOfAppointment =  findIndexOfObject($scope.appointments, q);
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

            $scope.newField = {};
            $scope.editing = false;
            $scope.displayedCollection = [].concat($scope.appointments);

            $scope.editRowCollection = function(q) {
                $scope.editing = $scope.appointments.indexOf(q);
                $scope.newField = angular.copy(q);
            };


            /* This function allows appointments to be removed from the Appointments
             dashboard inside fourtify-provider. */
            $scope.cancelAppointment = function(q) {
                var indexOfAppointment =  findIndexOfObject($scope.appointments, q);
                $scope.appointments.splice(indexOfAppointment, 1);
            }

            $scope.clearMessages = function(){
                $scope.err = null;
                $scope.pending = null;
                $scope.success = null;
            }
        }])

    .service('AppointmentsService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                getAppointments: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/appointments',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                createAppointment: function(params, success, error) {
                    var req = {
                        method: 'POST',
                        url: '/appointments',
                        data: params
                    };
                    this.apiCall(req, success, error);
                },
                deleteAppointment: function(params, success, error) {
                    var req = {
                        method: 'DELETE',
                        url: '/appointments/'+params.appointmentId,
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
 the appointments.
 */
function findIndexOfObject(arrayToSearch, keyToFind) {
    for (var i = 0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i] == keyToFind) {
            return i;
        }
    }
    return null;
}

