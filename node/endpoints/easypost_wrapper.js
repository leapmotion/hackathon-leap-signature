
'use strict';

//
// Simple Node.js wrapper for hitting the EasyPost API
// without exposing our secret key to the client.
//
var apiKey = 'Lb1QloAac_RMyQlpG0N1Bw';
var easypost = require('../../node_modules/node-easypost/lib/main.js')(apiKey);

// Create address given from input fields
exports.createAddress = function (request, response, params) {
    console.log("Creating addresses....");

    response.format({
        'application/json': function(){
            response.send({ message: 'hey' });
        }
    });
};

// Queries the best rates for a given dimension package + address
exports.queryRates = function (request, response, params) {
    console.log("Querying best address....");

    response.format({
        'application/json': function(){
            response.send({ message: 'hey' });
        }
    });
};


// set addresses
/**
var toAddress = {
    name: "Sawyer Bateman",
    street1: "1A Larkspur Cres.",
    street2: "",
    city: "St. Albert",
    state: "AB",
    zip: "t8n2m4",
    country: "CA",
    phone: "780-283-9384"
};
var fromAddress = {
    name: "Jon Calhoun",
    street1: "388 Townsend St",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    phone: "415-456-7890"
};

// verify address
easypost.Address.create(fromAddress, function(err, fromAddress) {
    fromAddress.verify(function(err, response) {
        if (err) {
            console.log('Address is invalid.');
        } else if (response.message !== undefined && response.message !== null) {
            console.log('Address is valid but has an issue: ', response.message);
            var verifiedAddress = response.address;
        } else {
            var verifiedAddress = response;
        }
    });
});

// set parcel
easypost.Parcel.create({
    predefined_package: "InvalidPackageName",
    weight: 21.2
}, function(err, response) {
    console.log(err);
});

var parcel = {
    length: 10.2,
    width: 7.8,
    height: 4.3,
    weight: 21.2
};


// create customs_info form for intl shipping
var customsItem = {
    description: "EasyPost t-shirts",
    hs_tariff_number: 123456,
    origin_country: "US",
    quantity: 2,
    value: 96.27,
    weight: 21.1
};

var customsInfo = {
    customs_certify: 1,
    customs_signer: "Hector Hammerfall",
    contents_type: "gift",
    contents_explanation: "",
    eel_pfc: "NOEEI 30.37(a)",
    non_delivery_option: "return",
    restriction_type: "none",
    restriction_comments: "",
    customs_items: [customsItem]
};

// create shipment
easypost.Shipment.create({
    to_address: toAddress,
    from_address: fromAddress,
    parcel: parcel,
    customs_info: customsInfo
}, function(err, shipment) {
    // buy postage label with one of the rate objects
    shipment.buy({rate: shipment.lowestRate(['USPS', 'ups'])}, function(err, response) {
        console.log(response.tracking_code);
        console.log(response.postage_label.label_url);
    });
});
*/