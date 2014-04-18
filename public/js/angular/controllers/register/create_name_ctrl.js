'use strict';

//
// Main control for handling Step 1 input changes
//
var RegisterCreateNameCtrl = function($scope, $timeout, $location) {



  $scope.onSaveName = function() {
    if ($scope.saveName === undefined || $scope.saveName == '') {
      $scope.inputNameClass = 'animated shake';
      return false;
    }

    $location.path('/start');
  }
};

RegisterCreateNameCtrl.$inject = ['$scope', '$timeout', '$location'];






 