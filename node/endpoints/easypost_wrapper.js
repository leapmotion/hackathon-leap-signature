
'use strict';

//
// Simple Node.js wrapper for hitting the EasyPost API
// without exposing our secret key to the client.
//
var apiKey = 'Lb1QloAac_RMyQlpG0N1Bw';
var easypost = require('../../node_modules/node-easypost/lib/main.js')(apiKey);
var async = require('async');

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
// Creates an EasyPost address from the specified
// address object.
//
function createFromAddress(params, resultOutput, callback) {
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
                callback(null, params, resultOutput);
            }
        });
    });
}

//
// Creates an EasyPost address from the specified
// address object.
//
function createToAddress(params, resultOutput, callback) {
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
                callback(null, params, resultOutput);
            }
        });
    });
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

    easypost.Parcel.create(
        parcel,
        function(err, response) {
            resultOutput.parcel = response;
            callback(null, params, resultOutput);
       }
    );
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
        resultOutput.shipment = shipment;
        callback(null, params, resultOutput);
    });
}


// buy postage label with one of the rate objects
//        shipment.buy({rate: shipment.lowestRate(['USPS', 'ups'])}, function(err, response) {
//            console.log(response.tracking_code);
//            console.log(response.postage_label.label_url);
//        });

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
           // console.log("LAST RESPONSE***** "  + JSON.stringify(resultOutput.shipment));
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
    for (var i = 0; i < rates.length; i++) {
        rate = rates[i];
        if (rate == null) {
            continue;
        }

        if (rate.rate < lowestRate && (validProviders.indexOf(rate.carrier) >= 0)) {
            lowestRate = rate.rate;
            result = rate;
        }
    }

    return result;
}