'use strict';

//
// Main app module setup
//
var mainApp = angular.module("app.ship-it", ['webStorageModule']);

//
// Session Variable Constants
//
var SESSION_SHIP_VARS = "app.ship_it.data";
var SESSION_START_ADDRESS = "start_address";
var SESSION_END_ADDRESS = "end_address";
var SESSION_PACKAGE_LENGTH = "package_length";
var SESSION_PACKAGE_WIDTH = "package_width";
var SESSION_PACKAGE_HEIGHT = "package_height";
var SESSION_PACKAGE_WEIGHT = "package_weight";