//
// Super basic express server for serving up our
// AngularJS files.
//
var express = require('express');
var app = express();
app.configure(function () {
    app.use(express.static(__dirname + '/public'));
    app.get('/', function(req, res) {
        res.render('app/index.html');
    });
});
app.listen(3000);
console.log("Server running on: http://localhost:3000/");