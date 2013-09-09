'use strict';

//
// Shipping Dimensions View Controller
// Main control for handling Step 2 input changes updates
//
function ShipDimensionsCtrl($scope, $timeout, $http) {
    var DEFAULT_NOT_AVAILABLE = "N/A"; // No data available
    var BEST_RATE_LOADING = "Calculating...";
    var BEST_RATE_ERROR = "Service Unavailable."; // API error
    var BEST_SERVICE_LOADING = "...";
    var PRICE_WAIT_TIME_MS = 2000; // Inactive time to wait before querying EasyPost API
    var _timeoutSliderChange = null;
    var _$http = $http;
    var _webStorage = $scope._webStorage;
    var _sessionData = _webStorage.get(SESSION_SHIP_VARS);

    // Initial default values
    $scope.valueLength = _sessionData.SESSION_PACKAGE_LENGTH;
    $scope.valueWidth = _sessionData.SESSION_PACKAGE_WIDTH;
    $scope.valueHeight = _sessionData.SESSION_PACKAGE_HEIGHT;
    $scope.valueWeight = _sessionData.SESSION_PACKAGE_WEIGHT;

    if (_sessionData.SESSION_EASYPOST_SHIPMENT_INFO != null) {
        $scope.valueBestPrice = _sessionData.SESSION_EASYPOST_SHIPMENT_INFO.rate;
    } else {
        $scope.valueBestPrice = DEFAULT_NOT_AVAILABLE;
    }

    if (_sessionData.SESSION_EASYPOST_SHIPMENT_INFO != null) {
        $scope.valueBestService = _sessionData.SESSION_EASYPOST_SHIPMENT_INFO.carrier;
    } else {
        $scope.valueBestService = DEFAULT_NOT_AVAILABLE;
    }

    //
    // Listeners for when one of the dimension slider fields
    // changes. At this point, we should query the EasyPost
    // API for an update with the data.
    //
    $scope.onSliderChanged = function(target) {
        cancelSliderChangeTimer(_timeoutSliderChange);
        setBestRates(BEST_RATE_LOADING, BEST_SERVICE_LOADING);
        _timeoutSliderChange = $timeout(queryBestRatesProxy, PRICE_WAIT_TIME_MS);

        // Reset session variables
        _sessionData.SESSION_PACKAGE_LENGTH = $scope.valueLength;
        _sessionData.SESSION_PACKAGE_WIDTH = $scope.valueWidth;
        _sessionData.SESSION_PACKAGE_HEIGHT = $scope.valueHeight;
        _sessionData.SESSION_PACKAGE_WEIGHT = $scope.valueWeight;
    };

    //
    // Cancels the 2-second EasyPost API timer to prevent
    // excessive hits on their API. Requires at least 2-seconds
    // of inactivity before pulling best rates.
    //
    function cancelSliderChangeTimer(promise) {
        if (promise != null) {
            $timeout.cancel(promise);
        }
    }

    //
    // Sets the UI-bound fields for best rate and
    // best service as needed.
    //
    function setBestRates(bestPrice, bestService) {
        $scope.valueBestPrice = BEST_RATE_LOADING;
        $scope.valueBestService = BEST_SERVICE_LOADING;
    }

    //
    // Proxy: Hits the EasyPost endpoint for finding the best
    // rates related to an address + dimensions combination.
    //
    function queryBestRatesProxy() {
        queryBestRates(
            _sessionData.SESSION_START_ADDRESS,
            _sessionData.SESSION_END_ADDRESS,
            $scope.valueLength,
            $scope.valueWidth,
            $scope.valueHeight,
            $scope.valueWeight);
        _webStorage.add(SESSION_SHIP_VARS, _sessionData);
    }

    //
    // Hits the EasyPost endpoint for finding the best
    // rates related to an address + dimensions combination.
    //
    function queryBestRates(startAddress,
                            endAddress,
                            valueLength,
                            valueWidth,
                            valueHeight,
                            valueWeight) {
        // TODO: Inject real addreses here, right now, Node.js
        // server just hardcodes to/fromt addresses
        var shipmentData = {
            'fromAddress': startAddress,
            'toAddress': endAddress,
            'packageLength': valueLength,
            'packageWidth': valueWidth,
            'packageHeight': valueHeight,
            'packageWeight': valueWeight
        };
        _$http.post('/ep_query_rates', shipmentData).success(function(data) {
            console.log("Query best rate " + JSON.stringify(data));
            if (data.shipmentData) {
                $scope.valueBestPrice = "$"+data.shipmentData.rate;
                $scope.valueBestService = data.shipmentData.carrier;
                _sessionData.SESSION_EASYPOST_SHIPMENT_INFO = data.shipmentData;
                _webStorage.add(SESSION_SHIP_VARS, _sessionData);
            }
        });
    }
}

ShipAddressCtrl.$inject = ['$scope', '$timeout', '$http'];
