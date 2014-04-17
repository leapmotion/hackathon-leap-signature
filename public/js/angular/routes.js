'use strict';

mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: 'partials/start.html', controller: StartCtrl}).
        when('/start', {templateUrl: 'partials/start.html', controller: StartCtrl}).
        when('/register/create-signature', {templateUrl: 'partials/register/create_signature.html', controller: RegisterCreateSignatureCtrl}).
        when('/register/create-name', {templateUrl: 'partials/register/create_name.html', controller: RegisterCreateNameCtrl}).
        when('/register/success', {templateUrl: 'partials/register/success.html', controller: RegisterSuccessCtrl}).
        when('/existing/sign-in', {templateUrl: 'partials/existing/sign_in.html', controller: ExistingSignInCtrl}).
        when('/welcome', {templateUrl: 'partials/welcome.html', controller: WelcomeCtrl}).

        otherwise({redirectTo: '/'});
}]);