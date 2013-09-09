'use strict';

mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: 'partials/ship/ship_address.html', controller: ShipAddressCtrl}).
        when('/ship/', {templateUrl: 'partials/ship/ship_address.html', controller: ShipAddressCtrl}).
        when('/ship/address', {templateUrl: 'partials/ship/ship_address.html', controller: ShipAddressCtrl}).
        when('/ship/dimensions', {templateUrl: 'partials/ship/ship_dimensions.html', controller: ShipDimensionsCtrl}).
        when('/ship/label', {templateUrl: 'partials/ship/ship_label.html', controller: ShipLabelCtrl}).
        otherwise({redirectTo: '/'});
}]);