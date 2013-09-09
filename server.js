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
});
app.listen(3000);
console.log("Server running on: http://localhost:3000/");