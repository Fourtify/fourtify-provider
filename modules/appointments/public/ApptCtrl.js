angular.module("appointments", [])


    // =========================================================================
    // Appointments Controllers ============================================================
    // =========================================================================
    .controller("ApptAllCtrl",[ "$scope", "AppointmentsService", "$uibModal",
        function ($scope, AppointmentsService, $uibModal) {

        $scope.appointments = [];


            //moment().format(lll);

        AppointmentsService.getAppointments(
            {},
            //success function
            function(data) {
                $scope.clearMessages();
                console.log("data "+i+": "+JSON.stringify(data));
                for(var i = 0; i < data.length; i++){
                    var appt = {};

                    appt._id = data[i]._id;
                    if(data[i]._visitor._id){       //Need first last name
                        console.log("visitor "+i+": "+JSON.stringify(data[i]._visitor._id));

                        appt.visitor = data[i]._visitor._id;
                    }
                    if(data[i]._start){
                        //appt.start = data[i]._start;
                        appt.start = moment(data[i]._start).format('lll');

                    }
                    if(data[i]._end){
                        //appt.end = data[i]._end;
                        appt.end = moment(data[i]._end).format('lll');
                    }
                    if(data[i]._status){
                        appt.status = data[i]._status;
                    }
                    $scope.appointments.push(appt);
                }
            },
            //error function
            function(data, status) {
                $scope.clearMessages();
                $scope.err = data;
            }

        );




        $scope.submitCreate = function(){
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
