
'use strict';

//
// Simple Node.js wrapper for hitting the EasyPost API
// without exposing our secret key to the client.
//
var apiKey = 'Lb1QloAac_RMyQlpG0N1Bw';
var easypost = require('../../node_modules/node-easypost/lib/main.js')(apiKey);
var async = require('async');

//
// Quick cache for storing created address data & parcel
// info. Ideally, we would cache this better, but since we're
// using hardcoded addresses, we can save some API calls.
//
var _CACHE_ADDRESS_INFO = {}; // Keyed by EasyPost address id => address object
var _CACHE_PARCEL_INFO = {}; // Keyed by EasyPost parcel id => parcel object
var _CACHE_SHIPMENT_INFO = {}; // Keyed by EasyPost shipment id => shipment object (for buy purchasing)

//
// TODO: Take in real to/from addresses from params.
//
//
// Hard coded addresses for now, initial
// Google Maps Step was just for show :P
//
var _fromAddress = {
    name: "Sean Janis",
    street1: "699 8th Street",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    phone: "555-555-5555"
};

//
// Hard coded addresses for now, initial
// Google Maps Step was just for show :P
//
var _toAddress = {
    name: "John Smith",
    street1: "1680 University Avenue",
    city: "Rochester",
    state: "NY",
    zip: "14610",
    phone: "555-555-5555"
};

//
// Creates a quick hash key from the given address object.
//
function createAddressHash(address) {
    var result = address.name + "_" + address.street1 + "_" + address.street2 +
        "_" + address.city + "_" + address.state + "_" + address.zip + "_" + address.phone;
    return result;
}

//
// Creates an EasyPost address from the specified
// address object.
//
function createFromAddress(params, resultOutput, callback) {
    // Handle cache first
    var addressHash = createAddressHash(_fromAddress);
    if (_CACHE_ADDRESS_INFO[addressHash] != null) {
        resultOutput.fromAddress = _CACHE_ADDRESS_INFO[addressHash];
        callback(null, params, resultOutput);
    } else {
        easypost.Address.create(_fromAddress, function(err, fromAddress) {
            fromAddress.verify(function(err, response) {
                var verifiedAddress;
                if (err) {
                    console.log('Address is invalid.');
                } else if (response.message !== undefined && response.message !== null) {
                    console.log('Address is valid but has an issue: ', response.message);
                    verifiedAddress = response.address;
                } else {
                    verifiedAddress = response;
                }

                if (verifiedAddress) {
                    resultOutput.fromAddress = verifiedAddress;
                    _CACHE_ADDRESS_INFO[addressHash] = verifiedAddress;
                    callback(null, params, resultOutput);
                }
            });
        });
    }
}

//
// Creates an EasyPost address from the specified
// address object.
//
function createToAddress(params, resultOutput, callback) {
    // Handle cache first
    var addressHash = createAddressHash(_toAddress);
    if (_CACHE_ADDRESS_INFO[addressHash] != null) {
        resultOutput.toAddress = _CACHE_ADDRESS_INFO[addressHash];
        callback(null, params, resultOutput);
    } else {
        easypost.Address.create(_toAddress, function(err, fromAddress) {
            fromAddress.verify(function(err, response) {
                var verifiedAddress;
                if (err) {
                    console.log('Address is invalid.');
                } else if (response.message !== undefined && response.message !== null) {
                    console.log('Address is valid but has an issue: ', response.message);
                    verifiedAddress = response.address;
                } else {
                    verifiedAddress = response;
                }

                if (verifiedAddress) {
                    resultOutput.toAddress = verifiedAddress;
                    _CACHE_ADDRESS_INFO[addressHash] = verifiedAddress;
                    callback(null, params, resultOutput);
                }
            });
        });
    }
}

//
// Creates an EasyPost parcel from the specified
// dimensions object.
//
function createParcel(params, resultOutput, callback) {
    var parcel = {
        length: params.packageLength,
        width: params.packageWidth,
        height: params.packageHeight,
        weight: params.packageWeight
    };

    var parcelHash = parcel.length + "_" + parcel.width + "_" + parcel.height + "_" + parcel.weight;
    if (_CACHE_PARCEL_INFO[parcelHash] != null) {
        resultOutput.parcel = _CACHE_PARCEL_INFO[parcelHash];
        callback(null, params, resultOutput);
    } else {
        easypost.Parcel.create(
            parcel,
            function(err, response) {
                resultOutput.parcel = response;
                _CACHE_PARCEL_INFO[parcelHash] = response;
                callback(null, params, resultOutput);
            }
        );
    }
}

//
// Creates an EasyPost shipment from the specified
// data object and figure out the cheapest shipment.
//
function createShipment(params, resultOutput, callback) {
    easypost.Shipment.create({
        to_address: resultOutput.toAddress.address,
        from_address: resultOutput.fromAddress.address,
        parcel: resultOutput.parcel
    }, function(err, shipment) {
        _CACHE_SHIPMENT_INFO[shipment.id] = shipment;
        resultOutput.shipment = shipment;
        callback(null, params, resultOutput);
    });
}

//
// Buys a given shipment
// TODO: Current EasyPost API is not returning a reason why
// this call fails, need to debug further.
//
exports.purchaseLabel = function (request, response, params) {
    var shipmentData = request.body;
    var cachedShipmentObj = _CACHE_SHIPMENT_INFO[shipmentData.shipment_id];
    if (cachedShipmentObj != null) {
        var bestRates = computeBestRate(cachedShipmentObj);
        cachedShipmentObj.buy([bestRates.carrier], function(err, newResponse) {
            // TODO: Fix why EasyPost buying is not working?
            //console.log(response.tracking_code);
            //console.log(response.postage_label.label_url);
            response.format({
                'application/json': function(){
                    response.send({ label: {
                        'tracking_code': response.tracking_code,
                        'label_url': response.label_url
                    } });
                }
            });
        })
    } else {
        // Error
        response.format({
            'application/json': function(){
                response.send({ label: {} });
            }
        });
    }
}

//
// Queries the best rates for a given dimension package + address
//
exports.queryRates = function (request, response, params) {
    console.log("Querying best address....");

    //
    // Async's waterfall is a great way to invoke EasyPost's API.
    // We'll want to first create addresses for the from / to recipient,
    // then create a parcel (based on package dimensions), then finally
    // create a shipment. If any of those calls fail, the next one won't
    // execute.
    //
    var data = request.body;
    var resultOutput = {};
    var waterfall = [
        function(callback) {
            callback(null, data, resultOutput);
        },
        createFromAddress,
        createToAddress,
        createParcel,
        createShipment,
        function(callback) {
            var bestRateData = computeBestRate(resultOutput.shipment);
            response.format({
                'application/json': function(){
                    response.send({ shipmentData: bestRateData });
                }
            });
        }
    ];

    async.waterfall(waterfall,
        function (err, result) {
            console.log("Waterfall error " + err);
        }
    );
};

//
// Parses through the shipment object and prepares a
// ready-to-use data object for populating the UI.
//
function computeBestRate(shipmentObj) {
    var result = {
        bestRate: 'N/A',
        bestProvider: 'N/A'
    };

    if (shipmentObj == null) {
        return result;
    }
    var rates = shipmentObj.rates;
    if (rates == null) {
        return result;
    }

    var rate;
    var validProviders = ['UPS', 'FedEx', 'USPS'];
    var lowestRate = 10000000;
    var tempRateFloat = 0;
    for (var i = 0; i < rates.length; i++) {
        rate = rates[i];
        if (rate == null) {
            continue;
        }

        tempRateFloat = parseFloat(rate.rate);
        if (tempRateFloat < lowestRate && (validProviders.indexOf(rate.carrier) >= 0)) {
            lowestRate = tempRateFloat;
            result = rate;
        }
    }

    return result;
}