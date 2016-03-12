angular.module("appointments", [])

    // =========================================================================
    // Visitors Controllers ============================================================
    // =========================================================================
    .controller("ApptAllCtrl",[ "$scope",  "$uibModal", "FourtifyService",
        function ($scope, CreateAppt, FourtifyService, $uibModal) {


        $scope.queue = [];

        $scope.submitCreate = function(){

            console.log("In submitCreate");
            console.log("$scope.name: "+$scope.name);
            console.log("$scope.reason: "+$scope.reason);
            console.log("$scope.start: "+$scope.start);


            $scope.error = null;
            //$scope.checkInformation = function() {      //Check inputs

                $scope.error = null;
                if (!$scope.name) {
                    $scope.error = "Visitor Name required!";
                }
                else if (!$scope.reason) {
                    $scope.error = "Reason required!";
                }
                else if (!$scope.start) {
                    $scope.error = "Start required!";
                }
                else if (!$scope.end) {
                    $scope.error = "End required!";
                }

                console.log("$scope.error: "+$scope.error);

                if (!$scope.error) {
                    console.log("no error: "+$scope.name );
                    FourtifyService.getVisitor({            //Get visitor data by email
                        email: 'rick@james.com'//$scope.name      //EMAIL (or ID?)
                    }, function (data) {
                        console.log("retrieved visitor: "+JSON.stringify(data[0]));
                        if(data.length > 0){
                            FourtifyService.createAppointment({     //Create appt params
                                visitor: data[0]._id,
                                start: $scope.start,
                                end: $scope.end
                            }, function (data2) {
                                console.log("data[0]._id: "+data[0]._id);
                                console.log("data2: "+data2[0]);
                                if(data.length > 0){
                                    $rootScope.visitor = data[0];
                                    $rootScope.appt = data2[0];
                                    if($rootScope.appt._start){
                                        $rootScope.appt._start = moment($rootScope.appt._start).format("dddd, h:mm a");
                                    }
                                    if($rootScope.appt._end){
                                        $rootScope.appt._end = moment($rootScope.appt._end).format("dddd, h:mm a");
                                    }
                                    $state.go("confirmation", {from:"information"}, {location:false});
                                }
                                else{
                                    $state.go("apptNotFound", {from:"information"}, {location:false});
                                }
                            }, function (data, status) {
                                $state.go("apptNotFound", {from:"information"}, {location:false});
                            });
                        }
                        else{
                            $state.go("apptNotFound", {from:"information"}, {location:false});
                        }
                    }, function (data, status) {
                        $state.go("apptNotFound", {from:"information"}, {location:false});
                    });

                    //@todo this is hard coded validation, in reality we would connect to the api and see if appointment exists
                    /*if($scope.fname == "none"){
                     //$state.go("confirmation", {from:"information"}, {location:false});
                     }
                     else
                     //$state.go("apptNotFound", {from:"information"}, {location:false});
                     }*/

                }
                else{
                    console.log("error found: "+$scope.error);
                }
            //}


            /*
            $scope.queue.push({
                name: $scope.name,
                provider: $scope.provider,
                reason: $scope.reason,
                date: $scope.date,
                time: $scope.time
            });
            $scope.name="";
            $scope.provider="";
            $scope.reason="";
            $scope.date="";
            $scope.time="";
            jQuery('#myModal').modal('hide');*/


        };
        $scope.newField = {};
        $scope.editing = false;
        $scope.displayedCollection = [].concat($scope.queue);

        $scope.editRowCollection = function(q) {
            $scope.editing = $scope.queue.indexOf(q);
            $scope.newField = angular.copy(q);
        };

        /* This function allows appointments to be removed from the Appointments
            dashboard inside fourtify-provider. */
        $scope.cancelAppointment = function(q) {
            var indexOfAppointment =  findIndexOfObject($scope.queue, q);
            $scope.queue.splice(indexOfAppointment, 1);
        }
    }])

    .service('FourtifyService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                getVisitor: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/visitors',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                createAppointment: function(params, success, error) {
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
                        console.log("success: "+data);
                        success(data);
                    }).error(function(data, status) {
                        console.log("error: "+status);
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
