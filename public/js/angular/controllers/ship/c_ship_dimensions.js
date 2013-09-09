'use strict';

//
// Global variables for purchasing labels
//
var g_webStorage;
var g_sessionData;
var g_$http;
var g_$scope;

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
    var LBS_TO_OUNCES = 16;
    var _timeoutSliderChange = null;
    var _$http = $http;
    var _$scope = $scope;
    var _webStorage = $scope._webStorage;
    var _sessionData = _webStorage.get(SESSION_SHIP_VARS);
    g_webStorage = $scope._webStorage;
    g_$http = $http;
    g_$scope = $scope;

    // Initial default values
    $scope.buttonBackDisabled = false;
    $scope.buttonShipDisabled = false;
    $scope.valueLength = _sessionData.SESSION_PACKAGE_LENGTH;
    $scope.valueWidth = _sessionData.SESSION_PACKAGE_WIDTH;
    $scope.valueHeight = _sessionData.SESSION_PACKAGE_HEIGHT;
    $scope.valueWeight = _sessionData.SESSION_PACKAGE_WEIGHT;
    setupFromSessionVariables();

    //
    // Sets up previous best rate data from LocalStorage
    // session variables.
    //
    function setupFromSessionVariables() {
        var needToCompute = false;
        if (_sessionData.SESSION_EASYPOST_SHIPMENT_INFO != null) {
            $scope.valueBestPrice = "$"+_sessionData.SESSION_EASYPOST_SHIPMENT_INFO.rate;
        } else {
            $scope.valueBestPrice = DEFAULT_NOT_AVAILABLE;
            needToCompute = true;
        }

        if (_sessionData.SESSION_EASYPOST_SHIPMENT_INFO != null) {
            $scope.valueBestService =
                _sessionData.SESSION_EASYPOST_SHIPMENT_INFO.carrier +
                " (" + _sessionData.SESSION_EASYPOST_SHIPMENT_INFO.service + ")";
        } else {
            $scope.valueBestService = DEFAULT_NOT_AVAILABLE;
            needToCompute = true;
        }

        // Need to force compute on first-time use
        if (needToCompute) {
            prepareLoadingState(true);
        }
    }

    //
    // Prepare the loading for finding parcel prices.
    //
    function prepareLoadingState(ignoreTimeout) {
        toggleButtonStates(false);
        setBestRates(BEST_RATE_LOADING, BEST_SERVICE_LOADING);

        // Reset session variables
        _sessionData.SESSION_PACKAGE_LENGTH = $scope.valueLength;
        _sessionData.SESSION_PACKAGE_WIDTH = $scope.valueWidth;
        _sessionData.SESSION_PACKAGE_HEIGHT = $scope.valueHeight;
        _sessionData.SESSION_PACKAGE_WEIGHT = $scope.valueWeight;

        if (ignoreTimeout) {
            queryBestRatesProxy();
        } else {
            _timeoutSliderChange = $timeout(queryBestRatesProxy, PRICE_WAIT_TIME_MS);
        }
    }

    //
    // Listeners for when one of the dimension slider fields
    // changes. At this point, we should query the EasyPost
    // API for an update with the data.
    //
    $scope.onSliderChanged = function(target) {
        cancelSliderChangeTimer(_timeoutSliderChange);
        prepareLoadingState();
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
        // server just hard codes to/front addresses
        var shipmentData = {
            'fromAddress': startAddress,
            'toAddress': endAddress,
            'packageLength': valueLength,
            'packageWidth': valueWidth,
            'packageHeight': valueHeight,
            'packageWeight': valueWeight * LBS_TO_OUNCES
        };
        _$http.post('/ep_query_rates', shipmentData).success(function(data) {
            if (data.shipmentData) {
                toggleButtonStates(true);
                _sessionData.SESSION_EASYPOST_SHIPMENT_INFO = data.shipmentData;
                _webStorage.add(SESSION_SHIP_VARS, _sessionData);
                setupFromSessionVariables();
            }
        });
    }

    //
    // Toggles whether the main buttons are enabled
    // or disabled when calculating costs.
    //
    function toggleButtonStates(enabled) {
        _$scope.buttonBackDisabled = !enabled;
        _$scope.buttonShipDisabled = !enabled;
    }
}

ShipAddressCtrl.$inject = ['$scope', '$timeout', '$http'];

//
// Hits the EasyPost endpoint for purchasing a
// shipment package.
//
function purchaseShippingLabel() {
    g_sessionData = g_webStorage.get(SESSION_SHIP_VARS);

    var shipmentData = g_sessionData.SESSION_EASYPOST_SHIPMENT_INFO;
    g_$http.post('/ep_purchase_label', shipmentData).success(function(data) {
        if (data.shipmentData) {
            // TODO: Fix reason why EasyPost is not purchasing correctly.
            g_$scope.trackingCode = "12345TEST";
            g_$scope.labelUrl = "http://www.easypost.com";
            g_$scope.$apply();
        }
    });
}