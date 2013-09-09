'use strict';

//
// Creates new init-google-map HTML AngularJS directive (tag) which allows
// for easy embedding of Google Map.
//

var _ShipAddressCtrl = {};

//
// Main control for handling Step 1 input changes
// and map updates
//
var ShipAddressCtrl = function($scope, $timeout) {
    var GEOCODE_WAIT_TIME_MS = 2000;
    var _scope = $scope;
    var _webStorage = $scope._webStorage;
    var _sessionData = _webStorage.get(SESSION_SHIP_VARS);
    var _mapGeocoder = new google.maps.Geocoder();
    var _timeoutStartAddress = null;
    var _timeoutEndAddress = null;
    var _markerStartAddress = {value:null};
    var _markerEndAddress = {value:null};
    var _lineMarker = null;
    $scope.mapDistance = 0;
    $scope.startAddress = _sessionData.SESSION_START_ADDRESS;
    $scope.endAddress = _sessionData.SESSION_END_ADDRESS;

    if ($scope.startAddress != null || $scope.endAddress != null) {
        geocodeStartAddress();
        geocodeEndAddress();
    }

    //
    // Listeners for when the start address field changes
    //
    $scope.onStartAddressChange = function () {
        cancelGeocodeTimer(_timeoutStartAddress);
        _timeoutStartAddress = $timeout(geocodeStartAddress, GEOCODE_WAIT_TIME_MS);
    };

    //
    // Listeners for when the end address field changes
    //
    $scope.onEndAddressChange = function () {
        cancelGeocodeTimer(_timeoutEndAddress);
        _timeoutEndAddress = $timeout(geocodeEndAddress, GEOCODE_WAIT_TIME_MS);
    };

    //
    // Cancels the 2-second geocode timer
    //
    function cancelGeocodeTimer(promise) {
        if (promise != null) {
            $timeout.cancel(promise);
        }
    }

    //
    // Wait 2 seconds to perform geocode lookup to prevent excessive API calls.
    //
    function geocodeStartAddress() {
        cancelGeocodeTimer(_timeoutStartAddress);
        _timeoutStartAddress = null;
        _sessionData.SESSION_START_ADDRESS = _scope.startAddress;
        gecodeLocationByAddress($scope.startAddress, _markerStartAddress, onResetViewportBounds);
    }

    //
    // Wait 2 seconds to perform geocode lookup to prevent excessive API calls.
    //
    function geocodeEndAddress() {
        cancelGeocodeTimer(_timeoutEndAddress);
        _timeoutEndAddress = null;
        _sessionData.SESSION_END_ADDRESS = _scope.endAddress;
        gecodeLocationByAddress($scope.endAddress, _markerEndAddress, onResetViewportBounds);
    }

    //
    // Resets the viewport to frame one or more address
    // markers.
    //
    function onResetViewportBounds() {
        var bounds = new google.maps.LatLngBounds();
        if (_markerStartAddress.value != null) {
            bounds.extend(_markerStartAddress.value.position);
        }

        if (_markerEndAddress.value != null) {
            bounds.extend(_markerEndAddress.value.position);
        }

        _ShipAddressCtrl.map.fitBounds(bounds);

        if (_lineMarker != null) {
            _lineMarker.setMap(null);
        }

        //
        // Draw line between start and end points
        // if start and end addresses are set.
        //
        if (_markerStartAddress.value != null &&
            _markerEndAddress.value != null) {
            var markerPath = [
                _markerStartAddress.value.position,
                _markerEndAddress.value.position
            ];

            _lineMarker = new google.maps.Polyline({
                path: markerPath,
                strokeColor: '#45a6a3',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });

            _lineMarker.setMap(_ShipAddressCtrl.map);
            var distance = google.maps.geometry.spherical.computeDistanceBetween(
                _markerStartAddress.value.position,
                _markerEndAddress.value.position);

            $scope.mapDistance = distance.toFixed(2);
            $scope.$apply();
        }
    }

    //
    // Google Maps geocoder for transforming raw user
    // inputted address into map coordinates.
    //
    function gecodeLocationByAddress(address, markerObj, onComplete) {
        _mapGeocoder.geocode( { 'address': address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                _ShipAddressCtrl.map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: _ShipAddressCtrl.map,
                    position: results[0].geometry.location
                });

                if (markerObj.value != null) {
                    markerObj.value.setMap(null);
                }

                markerObj.value = marker;
            } else {
                if (markerObj.value != null) {
                    markerObj.value.setMap(null);
                    markerObj.value = null;
                }
                console.log("Failed to geocode address: " + status);
            }

            _webStorage.add(SESSION_SHIP_VARS, _sessionData);
            onComplete();
        });
    }
};

ShipAddressCtrl.$inject = ['$scope', '$timeout'];






