//
// Super basic express server for serving up our
// AngularJS files.
//
var express = require('express');
var app = express();
var epw = require('./node/endpoints/easypost_wrapper');

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    // Routes
    app.post('/ep_query_rates', epw.queryRates);
    app.post('/ep_purchase_label', epw.purchaseLabel);
});
app.listen(process.env.PORT || 1065);
console.log("Server running on: http://localhost:1065/");