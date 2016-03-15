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
                deleteVisitor: function(params, success, error) {
                    var req = {
                        method: 'DELETE',
                        url: '/visitors/'+params.visitorId,
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


