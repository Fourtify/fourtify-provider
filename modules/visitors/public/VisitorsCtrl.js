angular.module("visitors", [])

    // =========================================================================
    // Visitors Controllers ============================================================
    // =========================================================================
    .controller("VisitorsAllCtrl",[ "$scope", "VisitorsService", "$uibModal",
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
