var express        = require('express');
var https          = require('https');
var http           = require('http');
var fs             = require('fs');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var MongoClient    = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var	groups = require('./api/groups');
var	students = require('./api/students');
var config = require('./config');
var CORSHandler = require('./cors').corsHandler;
var HttpLogger = require('./httpLogger').httpLogger
var ErrorHandler = require('./error').errorHandler

// var options = {
//   key: fs.readFileSync('keys/server.key'),
//   cert: fs.readFileSync('keys/server.csr'),
//   ca: fs.readFileSync('keys/ca.crt'),
// 	requestCert: true,
//     rejectUnauthorized: false

// };

//TODO: did not make it work with passphrase hardcoded, but maybe better not to put passphrase here:
// var options = {
//   key: [ fs.readFileSync('keys/tomcatkey.pem'), 'test' ],
//   cert: [ fs.readFileSync('keys/tomcatcert.pem'), 'test' ]
// };

// Credits to http://voidcanvas.com/create-ssl-https-server-in-nodejs/
var options = {
  key: fs.readFileSync('keys/privateKey.key'),
  cert: fs.readFileSync('keys/certificate.crt')
};

var app            = express();
var HTTP_PORT      = config.server.port.http;
var HTTPS_PORT     = config.server.port.https;

console.log(config.MONGO);

MongoClient.connect(config.MONGO, function(err, db) {
	"use strict";
	if(err) throw err;

	app.use(morgan('dev'));                     // log every request to the console
	app.use(bodyParser());                      // pull information from html in POST
	app.use(methodOverride()); 

	app.use(CORSHandler);
	app.use(HttpLogger);
	app.use('/css', express.static(__dirname + '/css'));
	app.use(express.static(__dirname + '/public'));
	app.use(ErrorHandler);
	
    // Application routes
	groups(app, db);
	students(app, db);

    console.log("App listening on HTTP port " + HTTP_PORT);
    console.log("App listening on HTTPS port " + HTTPS_PORT);

	// Create an HTTP service.
	http.createServer(app).listen(HTTP_PORT);
	// Create an HTTPS service identical to the HTTP service.
	https.createServer(options, app).listen(HTTPS_PORT);

});
