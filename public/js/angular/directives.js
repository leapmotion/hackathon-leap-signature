'use strict';


//
// Borrowed method to add a directive for going directly
// to a partial's page.
//
mainApp.directive('linkClick', function ($location) {
    return function(scope, element, attrs) {
        var path;

        attrs.$observe('linkClick', function (val) {
            path = val;
        });

        element.bind('click', function () {
            scope.$apply( function () {
                $location.path(path);
            });
        });
    };
});

//
// Borrowed method to add a directive for going directly
// to a partial's page.
//
mainApp.directive('linkClickBuyLabel', function ($location) {
    return function(scope, element, attrs) {
        var path;

        attrs.$observe('linkClickBuyLabel', function (val) {
            path = val;
        });

        element.bind('click', function () {
            purchaseShippingLabel();

            scope.$apply( function () {
                $location.path(path);
            });
        });
    };
});

//
// Borrowed method to add a directive for going directly
// to a partial's page.
//
mainApp.directive('linkClickPrintLabel', function ($location) {
    return function(scope, element, attrs) {
        var path;

        attrs.$observe('linkClickPrintLabel', function (val) {
            path = val;
        });

        element.bind('click', function () {
            window.print();

            scope.$apply( function () {
                $location.path(path);
            });
        });
    };
});

//
// New directive for letting us embed an init-google-map
// html tag into our partial shipping page.
//
mainApp.directive('initGoogleMap', function ($compile) {
    return function (scope, elem, attrs) {
        var latitude = attrs.latitude && parseFloat(attrs.latitude, 10) || 43.074688;
        var longitude = attrs.longitude && parseFloat(attrs.longitude, 10) || -89.384294;

        _ShipAddressCtrl.mapOptions = {
            zoom: 15,
            disableDefaultUI: true,
            center: new google.maps.LatLng(latitude, longitude)
        };

        _ShipAddressCtrl.map = new google.maps.Map(elem[0], _ShipAddressCtrl.mapOptions);
    };
});
