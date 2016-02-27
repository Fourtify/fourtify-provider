angular.module("employee", [])

    // =========================================================================
    // Employee Controllers ============================================================
    // =========================================================================
    .controller("EmployeeAllCtrl",[ "$scope", "EmployeeService", "$uibModal",
        function ($scope, EmployeeService, $uibModal) {

        $scope.err = null;
        $scope.pending = {_msg : "Loading page..."};
        $scope.success = null;

        //initial settings
        $scope.groups = [];
        $scope.employee = [];
        $scope.employeeCount = 0;
        $scope.archivedEmployeeCount = 0;
        $scope.selectedGroup = { '_title': 'All' };

        //pagination settings
        $scope.page = 1;
        $scope.perPage = 20;
        $scope.paginate = true;
        $scope.sort = 1;
        $scope.sortBy = "name";
        $scope.search = "";
        $scope.activeRequest = null;

        $scope.getGroupsAndEmployee = function(data){
            var queryObj = {
                include: "name,phone,email,profileImage",
                page:$scope.page,
                perPage:$scope.perPage,
                paginate:$scope.paginate,
                sortBy:$scope.sortBy,
                sort: $scope.sort
            };
            if ($scope.selectedGroup && $scope.selectedGroup._id) {
                queryObj.groups = [""+$scope.selectedGroup._id];
            }
            if ($scope.search) {
                queryObj.search = $scope.search;
            }
            //@todo need to get a count of the results so we can paginate
            async.parallel([
                    function(callback){
                        EmployeeService.getGroups(
                            {include: "title,employee"},
                            //success function
                            function(data) {
                                $scope.groups = data;
                                $scope.groups.map(function(g){if(!g._employee){g._employee=[]}return g;});
                                callback(null);
                            },
                            //error function
                            function(data, status) {
                                callback(data);
                            }
                        );
                    },
                    function(callback){
                        EmployeeService.getEmployee(
                            queryObj,
                            //success function
                            function(data) {
                                $scope.employee = data;
                                callback(null);
                            },
                            //error function
                            function(data, status) {
                                callback(data);
                            }
                        );
                    },
                    function(callback){
                        EmployeeService.getEmployeeCount(
                            queryObj,
                            //success function
                            function(data) {
                                $scope.employeeCount = data.count;
                                callback(null);
                            },
                            //error function
                            function(data, status) {
                                callback(data);
                            }
                        );
                    }
                ],
                function(err, results){
                    $scope.clearMessages();
                    if(err){
                        $scope.err = err;
                    }
                    else if(data){
                        $scope.success = data.success;
                    }
                });
        };

        $scope.getGroupsAndEmployee();

        $scope.selectGroup = function(group) {
            $scope.selectedGroup = group;
            $scope.update();
        };

        $scope.setPerPage = function(perPage) {
            $scope.paginate = perPage!=-1;
            $scope.perPage = perPage;
            $scope.update();
        };

        $scope.searchEmployee = function(str) {
            $scope.search = str;
            $scope.update();
        };

        $scope.selectSort = function(sortBy, sort) {
            $scope.sortBy = sortBy;
            $scope.sort = sort;
            $scope.update();
        };

        $scope.changePage = function(page) {
            $scope.page = page;
            $scope.update();
        };

        $scope.resetFilters = function() {
            $scope.page = 1;
            $scope.perPage = 20;
            $scope.paginate = true;
            $scope.sort = 1;
            $scope.sortBy = "name";
            $scope.search = "";
            $scope.update();
        };

        $scope.update = function(data) {
            clearTimeout($scope.activeRequest);
            $scope.activeRequest = setTimeout(function() {
                $scope.getGroupsAndEmployee(data);
            }, 400);
        };

        $scope.isEmpty = function(obj) {
            for(var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            return true;
        };

        /**** Employee Modals ****/
        // Create Employee modal
        $scope.createEmployee = function() {
            $scope.clearMessages();

            var modalInstance = $uibModal.open({
                templateUrl: '/templates/employee/create',
                controller: 'EmployeeCreateCtrl',
                size: "md",
                resolve: {
                    groups: function () {
                        return $scope.groups;
                    },
                    selectedGroup: function() {
                        return $scope.selectedGroup;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if (data.err) {
                    $scope.err = data.err;
                }
                else {
                    $scope.update(data);
                }
            });
        }; // end $scope.createEmployee
        // Update Employee modal
        $scope.updateEmployee = function(employee) {
            $scope.clearMessages();

            var modalInstance = $uibModal.open({
                templateUrl: '/templates/employee/update',
                controller: 'EmployeeUpdateCtrl',
                size: "md",
                resolve: {
                    groups: function () {
                        return $scope.groups;
                    },
                    employee: function() {
                        return employee;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if (data.err) {
                    $scope.err = data.err;
                }
                else {
                    $scope.update(data);
                }
            });
        }; // end $scope.updateEmployee
        // Delete Employee modal
        $scope.deleteEmployee = function(employee) {
            $scope.clearMessages();

            var modalInstance = $uibModal.open({
                templateUrl: '/templates/employee/delete',
                controller: 'EmployeeDeleteCtrl',
                size: "md",
                resolve: {
                    employee: function () {
                        return employee;
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
                    $scope.update(data);
                }
            });
        }; // end $scope.deleteEmployee


        /**** Groups Modals ****/
        //Create Group modal
        $scope.createGroup = function() {
            $scope.clearMessages();

            var modalInstance = $uibModal.open({
                templateUrl: '/templates/employee/groups/create',
                controller: 'EmployeeGroupsCreateCtrl',
                size: "md",
                resolve: {}
            });

            modalInstance.result.then(function (data) {
                if (data.err) {
                    $scope.err = data.err;
                }
                else {
                    $scope.success = data.success;
                    $scope.groups.push(data.data);
                }
            });
        }; // end $scope.createGroup

        //Update Group modal
        $scope.updateGroup = function(group) {
            $scope.clearMessages();

            var modalInstance = $uibModal.open({
                templateUrl: '/templates/employee/groups/update',
                controller: 'EmployeeGroupsUpdateCtrl',
                size: "md",
                resolve: {
                    "groupId": function () {
                        return group._id;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if (data.err) {
                    $scope.err = data.err;
                }
                else {
                    $scope.success = {_msg:"Employee Group has been successfully updated."}
                    //update group name if it has changed
                    var groupsPos = $scope.groups.map(function(e) { return e._id; }).indexOf(data.data._id);
                    if (groupsPos >=0 ) {
                        $scope.groups[groupsPos] = data.data;
                    }
                }
            });
        }; // end $scope.updateGroup

        //Delete confirmation modal
        $scope.deleteGroup = function(group) {
            $scope.clearMessages();

            var modalInstance = $uibModal.open({
                templateUrl: '/templates/employee/groups/delete',
                controller: 'EmployeeGroupsDeleteCtrl',
                size: "md",
                resolve: {
                    "groupId": function() {
                        return group._id;
                    },
                    "groupTitle": function() {
                        return group._title;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if (data.err) {
                    $scope.err = data.err
                }
                else {
                    $scope.success = data.success;
                    var groupsPos = $scope.groups.map(function(e) { return e._id; }).indexOf(group._id);
                    if (groupsPos >=0 ) {
                        $scope.groups.splice(groupsPos);
                    }
                }
            });
        }; // end $scope.deleteConfirm

        $scope.clearMessages = function(){
            $scope.err = null;
            $scope.pending = null;
            $scope.success = null;
        }
    }])

    .controller("EmployeeCreateCtrl", ["$scope", "$uibModalInstance", "groups", "selectedGroup", "EmployeeService",
        function ($scope, $uibModalInstance, groups, selectedGroup, EmployeeService) {

        $scope.err = null;
        $scope.pending =  null;
        $scope.success = null;

        $scope.name = {};
        $scope.groups = groups;
        $scope.selectedGroups = [];
        if (selectedGroup && selectedGroup._id) {
            $scope.selectedGroups.push(selectedGroup._id);
        }
        $scope.address = {};
        $scope.phone = {};
        $scope.dob = {};
        $scope.company = {};
        $scope.phone.type = "Mobile";
        $scope.randomPassword = true;
        $scope.sendEmailVerification = true;
        $scope.sendWelcomeEmail = false;
        $scope.isCollapsedEmployeeAddress = true;

        $scope.dobOpts = {};
        $scope.dobOpts.months = [
            {value: '01', name: 'January'},
            {value: '02', name: 'February'},
            {value: '03', name: 'March'},
            {value: '04', name: 'April'},
            {value: '05', name: 'May'},
            {value: '06', name: 'June'},
            {value: '07', name: 'July'},
            {value: '08', name: 'August'},
            {value: '09', name: 'September'},
            {value: '10', name: 'October'},
            {value: '11', name: 'November'},
            {value: '12', name: 'December'}
        ];

        $scope.dobOpts.days = [];
        for(var i = 1; i <= 31; i++) {
            if (i < 10) {
                $scope.dobOpts.days.push('0' + i);
            }
            else{
                $scope.dobOpts.days.push(i);
            }
        }

        $scope.dobOpts.years = [];
        var currentYear = moment().format("YYYY");
        for(i = currentYear; i > currentYear - 100; i--) {
            $scope.dobOpts.years.push(i);
        }

        $scope.selectGroup = function(groupId) {
            var pos = $scope.selectedGroups.indexOf(groupId);
            if (pos == -1) {
                $scope.selectedGroups.push(groupId);
            }
            else{
                $scope.selectedGroups.splice(pos, 1);
            }
        };

        $scope.createFormProcess = function() {
            $scope.clearMessages();

            //make sure all dob fields are filled in if any is filled
            var dob = null;
            if ($scope.dob.year || $scope.dob.month || $scope.dob.day) {
                if (!($scope.dob.year && $scope.dob.month && $scope.dob.day)) {
                    return $scope.err = {_code:"ANG000", _msg:"Either all parts or no parts of DOB should be filled in."};
                }
                dob = moment($scope.dob.year + '-' + $scope.dob.month + '-' + $scope.dob.day);
            }
            //if password is filled in, make sure it matches with confirm
            if (!$scope.randomPassword && $scope.password && ($scope.password !== $scope.passwordConfirm)) {
                return $scope.err = {_code:"ANG000", _msg:"Passwords do not match!"};
            }
            //constructing phoneObj
            var phoneObj = [];
            if ($scope.phone.number && $scope.phone.type) {
                phoneObj.push({
                    type: $scope.phone.type,
                    number: $scope.phone.number
                });
            }

            var employeeObj = {
                "name": {
                    "first": $scope.name.first,
                    "last": $scope.name.last
                },
                "gender": $scope.gender,
                "dob": dob,
                "email": {
                    "value": $scope.email
                },
                "password": {
                    "value": $scope.password,
                    "requireUpdate" : $scope.randomPassword
                },
                "phone": phoneObj,
                "address": [{
                    "type": "Residential",
                    "street": $scope.address.street,
                    "city": $scope.address.city,
                    "state": $scope.address.state,
                    "zip": $scope.address.zip
                }],
                groups: $scope.selectedGroups,
                randomPassword: $scope.randomPassword,
                sendEmailVerification: $scope.sendEmailVerification,
                sendWelcomeEmail: $scope.sendWelcomeEmail
            };

            $scope.pending = {_msg:"Creating Employee..."};
            EmployeeService.createEmployee(
                employeeObj,
                //success function
                function(data) {
                    $uibModalInstance.close({
                        success: {_msg:"Employee successfully created!"},
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

    .controller("EmployeeUpdateCtrl", ["$scope", "$uibModalInstance", "employee", "groups", "EmployeeService",
        function ($scope, $uibModalInstance, employee, groups, EmployeeService) {

        $scope.err = null;
        $scope.pending = {_msg:"Getting employee details..."};
        $scope.success = null;

        // STAFF FIELDS
        $scope.name = {};
        $scope.groups = groups;
        $scope.selectedGroups = [];
        $scope.address = [];
        $scope.phone = [];
        $scope.dob = {};
        $scope.phone.type = "Mobile";
        $scope.randomPassword = true;
        $scope.sendEmailVerification = true;
        $scope.sendWelcomeEmail = false;
        $scope.isCollapsedEmployeeAddress = true;

        // DOBOPTS

        $scope.dobOpts = {};
        $scope.dobOpts.months = [
            {value: '01', name: 'January'},
            {value: '02', name: 'February'},
            {value: '03', name: 'March'},
            {value: '04', name: 'April'},
            {value: '05', name: 'May'},
            {value: '06', name: 'June'},
            {value: '07', name: 'July'},
            {value: '08', name: 'August'},
            {value: '09', name: 'September'},
            {value: '10', name: 'October'},
            {value: '11', name: 'November'},
            {value: '12', name: 'December'}
        ];

        $scope.dobOpts.days = [];
        for(var i = 1; i <= 31; i++) {
            if (i < 10) {
                $scope.dobOpts.days.push('0' + i);
            }
            else{
                $scope.dobOpts.days.push(i);
            }
        }

        $scope.dobOpts.years = [];
        var currentYear = moment().format("YYYY");
        for(i = currentYear; i > currentYear - 100; i--) {
            $scope.dobOpts.years.push(String(i));
        }

        // GROUP SELECTION
        $scope.selectGroup = function(groupId) {
            var pos = $scope.selectedGroups.indexOf(groupId);
            if (pos == -1) {
                $scope.selectedGroups.push(groupId);
            }
            else{
                $scope.selectedGroups.splice(pos, 1);
            }
        };

        EmployeeService.getEmployee(
            {
                id: employee._id
            },
            //success function
            function(data) {
                $scope.employee = data;
                if(data._name && data._name._first){
                    $scope.name.first = data._name._first;
                }
                if(data._name && data._name._last){
                    $scope.name.last = data._name._last;
                }
                if(data._email && data._email._value){
                    $scope.email = data._email._value;
                }
                if(data._gender){
                    $scope.gender = data._gender;
                }
                if(data._dob){
                    $scope.dob.year = moment(data._dob._birthday).format('YYYY');
                    $scope.dob.month = moment(data._dob._birthday).format('MM');
                    $scope.dob.day = moment(data._dob._birthday).format('DD');
                }

                //@todo come back to array of phone and addresses when we have time
                // PHONE
                /*if (data._phone) {
                    $scope.phone = data._phone;
                    /*for (var i = 0; i < $scope.contact.phone.length; i = i + 1) {
                        if ($scope.contact.phone[i].type == 'Business')
                            $scope.company.phone = $scope.contact.phone[i].number;
                        else
                            $scope.phone = $scope.contact.phone[i];
                    }*/
                /*}

                if (data._address) {
                    $scope.address = data._address;
                }

                if (data._profileImage) {
                    $scope.profileImage = data._profileImage;
                }*/
                if(data._groups){
                    $scope.selectedGroups = data._groups.map(function(g){return g._id;});
                }
                $scope.clearMessages();

            },
            //error function
            function(data, status) {
                $scope.clearMessages();
                $scope.err = data;
            }
        );

        $scope.updateFormProcess = function() {

            $scope.clearMessages();

            var dob = null;
            var phoneObj = [];
            var addressObj = [];

            //make sure all dob fields are filled in if any is filled
            if ($scope.dob.year || $scope.dob.month || $scope.dob.day) {
                if (!($scope.dob.year && $scope.dob.month && $scope.dob.day)) {
                    return $scope.err = {_code:"ANG000", _msg:"Either all parts or no parts of DOB should be filled in."};
                }
                dob = moment($scope.dob.year + '-' + $scope.dob.month + '-' + $scope.dob.day);
            }
            //if password is filled in, make sure it matches with confirm
            if ($scope.password&&($scope.password!==$scope.passwordConfirm)) {
                return $scope.err = {_code:"ANG000", _msg:"Passwords do not match!"};
            }
            /*
            //constructing phoneObj
            if ($scope.phone.number && $scope.phone.type) {
                phoneObj.push({
                    type: $scope.phone.type,
                    number: $scope.phone.number
                });
            }

            // Constructing addressObj
            if ($scope.address) {
                addressObj = [{
                    "type": "Residential",
                    "street": $scope.address.street,
                    "city": $scope.address.city,
                    "state": $scope.address.state,
                    "zip": $scope.address.zip
                }];
            }*/

            var employeeObj = {
                "name": {
                    "first": $scope.name.first,
                    "last": $scope.name.last
                },
                "gender": $scope.gender,
                "dob": dob,
                "email": {
                    "value": $scope.email
                },
                "groups": $scope.selectedGroups
            };

            $scope.pending = {_msg:"Updating Employee..."};
            EmployeeService.updateEmployeeProfile(
                $scope.employee._id,
                employeeObj,
                function(data) {
                    $uibModalInstance.close({
                        success: {_msg:"Employee has been successfully updated!"},
                        data: data
                    });
                },
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

    .controller("EmployeeDeleteCtrl", ["$scope", "$uibModalInstance", "employee", "EmployeeService",
        function ($scope, $uibModalInstance, employee, EmployeeService) {

        $scope.deleteEmployee = employee;

        $scope.delete = function () {

            EmployeeService.deleteEmployee(
                $scope.deleteEmployee._id,
                //success function
                function(data) {
                    $uibModalInstance.close({
                        success: {_msg:"Employee has been successfully deleted!"},
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

    .controller("EmployeeGroupsCreateCtrl",["$scope", "$uibModalInstance", "EmployeeService",
        function ($scope, $uibModalInstance, EmployeeService) {

        $scope.err = null;
        $scope.pending = null;
        $scope.success = null;

        $scope.group = {
            //visibility: $scope.visibilityOpt[0].value,
            access: [
                'employee',
                'customers',
                'bookings',
                'notifications',
                'general'
            ]
        };

        $scope.toggleAccess = function(module) {
            var index = $scope.group.access.indexOf(module);
            if (index > -1) {
                $scope.group.access.splice(index, 1);
            } else {
                $scope.group.access.push(module);
            }
        };

        $scope.createFormProcess = function() {
            $scope.clearMessages();
            $scope.pending = {_msg: "Creating Employee Group..."};

            var groupObj = {
                "title": $scope.group.title,
                "description": $scope.group.description,
                "privilages": []
                //"access": $scope.group.access,
                //"visibility": $scope.group.visibility
            };

            EmployeeService.createGroup(
                groupObj,
                //success function
                function(data) {
                    $uibModalInstance.close({
                        success: {_msg: "Employee Group Successfully Created"},
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

    .controller("EmployeeGroupsUpdateCtrl", ["$scope", "$uibModalInstance", "groupId", "EmployeeService",
        function ($scope, $uibModalInstance, groupId, EmployeeService) {

        $scope.err = null;
        $scope.pending = {_msg:"Getting group details..."};
        $scope.success = null;

        $scope.groupId = groupId;
        $scope.group = {};

        //Get group details for editing
        EmployeeService.getGroups(
            {id: $scope.groupId},
            //success function
            function(data) {
                $scope.clearMessages();
                if(data._id){
                    $scope.group.id = data._id;
                }
                if(data._title){
                    $scope.group.title = data._title;
                }
                if(data._description){
                    $scope.group.description = data._description;
                }
            },
            //error function
            function(data, status) {
                $scope.clearMessages();
                $scope.err = data;
            }
        );

        $scope.toggleAccess = function(module) {
            var index = $scope.group.access.indexOf(module);
            if (index > -1) {
                $scope.group.access.splice(index, 1);
            } else {
                $scope.group.access.push(module);
            }
        };

        $scope.updateFormProcess = function() {
            $scope.clearMessages();
            $scope.pending = {_msg:"Updating group details..."};

            var groupObj = {
                "title": $scope.group.title,
                "description": $scope.group.description,
                "privileges": []
            };

            EmployeeService.updateGroup(
                groupId,
                groupObj,
                //success function
                function(data) {
                    $scope.clearMessages();
                    $uibModalInstance.close({
                        success: {_msg:"Group "+$scope.group.title + " updated successfully"},
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

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.clearMessages = function(){
            $scope.err = null;
            $scope.pending = null;
            $scope.success = null;
        }
    }])

    .controller("EmployeeGroupsDeleteCtrl",["$scope", "$uibModalInstance", "groupTitle", "groupId", "EmployeeService",
        function ($scope, $uibModalInstance, groupTitle, groupId, EmployeeService) {

        $scope.deleteGroupId = groupId;
        $scope.groupTitle = groupTitle;

        $scope.delete = function () {
            EmployeeService.deleteGroup(
                groupId,
                //success function
                function(data) {
                    $uibModalInstance.close({
                        success: {_msg: groupTitle+" successfully deleted!"},
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

    .controller("EmployeeSettingsCtrl", function ($scope, EmployeeService, $uibModal, $filter, $timeout, $location) {

        $scope.err = {};
        $scope.success = {};

        $scope.profile = {};
        $scope.collapseChangePassword = true;

        $scope.changePassword = {
            new: '',
            verify: '',
            hasError: false,
            change: function() {
                EmployeeService.updatePassword(
                    $scope.profile._id,
                    this.new,
                    function(data) {
                        $scope.success.show = true;
                        $scope.success.msg = "Successfully changed password. Logging you out...";

                        $timeout(function() {
                            $location.path('/logout');
                        }, 2000);
                    },
                    function(data, status) {
                        $scope.err.show = true;
                        $scope.err.msg = "Error Code: " + status + " - " + data.error_description;
                    }
                );
            },
            validate: function() {
                if (this.new !== this.verify) {
                    this.hasError = true;
                } else {
                    this.hasError = false;
                }
            }
        };

        EmployeeService.getProfile(
            function(data) {
                $scope.profile = data;
            },
            function(data, status) {
                $scope.err.show = true;
                $scope.err.msg = "Error Code: " + status + " - " + data.error_description;
            }
        );
    })

    .service('EmployeeService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                //Groups API
                getGroups: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/employee/groups',
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
