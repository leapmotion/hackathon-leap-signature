'use strict';

mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: 'partials/ship/ship_address.html', controller: ShipAddressCtrl}).
        otherwise({redirectTo: '/'});
}]);