angular.module("forms", [])

    // =========================================================================
    // Forms Controllers ============================================================
    // =========================================================================
    .controller("FormsAllCtrl",[ "$scope", "FormsService", "$uibModal",
        function ($scope, FormsService, $uibModal) {

    }])

    .service('FormsService', [

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
