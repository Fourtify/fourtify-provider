angular.module("appointments", [])

    // =========================================================================
    // Visitors Controllers ============================================================
    // =========================================================================
    .controller("ApptAllCtrl",[ "$scope", "VisitorsService", "$uibModal",
        function ($scope, VisitorsService, $uibModal) {


        $scope.queue = [];

        $scope.submitCreate = function(){
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
            jQuery('#myModal').modal('hide');
        };
        $scope.newField = {};
        $scope.editing = false;
        $scope.displayedCollection = [].concat($scope.queue);

        $scope.editRowCollection = function(q) {
            $scope.editing = $scope.queue.indexOf(q);
            $scope.newField = angular.copy(q);
        };

        /* This function allows appointments to be removed from the Appointments
            dashboard. */
        $scope.cancel = function(q) {
            var indexOfAppointment =  findIndexOfObject($scope.queue, q);
            $scope.queue.splice(indexOfAppointment, 1);
        }
    }])

    .service('VisitorsService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                //Groups API
                getGroups: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/visitors',
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
