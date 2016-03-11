angular.module("queueHistory", [])

    // =========================================================================
    // Visitors Controllers ============================================================
    // =========================================================================
    .controller("QHAllCtrl",[ "$scope", "qHService", "$uibModal",
        function ($scope, qHService, $uibModal) {
        }])

    .service('qHService', [
        '$http',
        function ($http, $rootScope, $window) {

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
