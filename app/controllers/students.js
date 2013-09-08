/*
 * students.js
 *
 * Node.js endpoint for querying data about
 * existing students. For example, users can query 'Stanford'
 * and this endpoint would return a JSON-encoded array
 * of all students matching the 'Stanford' school tag.
 */

/**
 * Test Data
 *
 * NOTE: In an ideal world, this data would be retrieved from a database
 * or caching layer. For illustration purposes, I created a random
 * list of students to query against.
 */
var _testStudents;

// Initializes the test student data file
if (_testStudents == null) {
    var fs = require('fs');
    var file = __dirname + '/../../public/test_students/test_students.json';

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log('File read error: ' + err);
            return;
        }

        _testStudents = JSON.parse(data);
    });
}

/** Main controller response for invokers retrieving data. */
var Students = function () {
    this.search = function (req, resp, params) {
        params.result = _testStudents;

        this.respond(params, {
            format: 'json'
        });
    };
};

exports.Students = Students;
