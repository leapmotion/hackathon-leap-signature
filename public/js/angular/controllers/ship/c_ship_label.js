'use strict';

//
// Shipping Print Label View Controller
//
var _ShipLabelCtrl = {};

//
// Main control for handling Step 3 print label
//
function ShipLabelCtrl($scope, $timeout) {
    var DEFAULT_NOT_AVAILABLE = "N/A"; // No data available
    var _$scope = $scope;
    var _webStorage = $scope._webStorage;
    var _sessionData = _webStorage.get(SESSION_SHIP_VARS);
    setupFromSessionVariables();

    //
    // Sets up previous best rate data from LocalStorage
    // session variables.
    //
    function setupFromSessionVariables() {
        if (_sessionData.SESSION_EASYPOST_SHIPMENT_INFO != null) {
            $scope.valueBestPrice = "$"+_sessionData.SESSION_EASYPOST_SHIPMENT_INFO.rate;
        } else {
            $scope.valueBestPrice = DEFAULT_NOT_AVAILABLE;
        }

        if (_sessionData.SESSION_EASYPOST_SHIPMENT_INFO != null) {
            $scope.valueBestService =
                _sessionData.SESSION_EASYPOST_SHIPMENT_INFO.carrier +
                    " (" + _sessionData.SESSION_EASYPOST_SHIPMENT_INFO.service + ")";
        } else {
            $scope.valueBestService = DEFAULT_NOT_AVAILABLE;
        }
    }
}

ShipAddressCtrl.$inject = ['$scope', '$timeout'];

