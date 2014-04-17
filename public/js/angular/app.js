'use strict';

//
// Main app module setup
//
var mainApp = angular.module("app.leap-signature", ['webStorageModule']);

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
var SESSION_EASYPOST_START_ADDRESS = "easypost_start_address_id";
var SESSION_EASYPOST_END_ADDRESS = "easypost_end_address_id";
var SESSION_EASYPOST_PARCEL_ID = "easypost_parcel_id";
var SESSION_EASYPOST_PARCEL_BEST_RATE = "easypost_parcel_best_rate";
var SESSION_EASYPOST_PARCEL_BEST_PROVIDER = "easypost_parcel_best_provider";
var SESSION_EASYPOST_SHIPMENT_INFO = "easypost_parcel_shipment_info";