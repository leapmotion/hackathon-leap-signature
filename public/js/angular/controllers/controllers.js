'use strict';

//
// Main empty ctrl for entire single-page app
//
function MainCtrl($scope, webStorage) {
    $scope._webStorage = webStorage;

    // Add first time variables if not created
    var sessionData = webStorage.get(SESSION_SHIP_VARS);
    if (sessionData == null) {
        sessionData = {
            SESSION_START_ADDRESS: "",
            SESSION_END_ADDRESS: "",
            SESSION_PACKAGE_LENGTH: 10,
            SESSION_PACKAGE_WIDTH: 12,
            SESSION_PACKAGE_HEIGHT: 3,
            SESSION_PACKAGE_WEIGHT: 8
        };

        webStorage.add(SESSION_SHIP_VARS, sessionData);
    }
}

MainCtrl.$inject = ['$scope', 'webStorage'];