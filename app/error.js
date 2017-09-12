// Error handling middleware
var log4js = require('log4js'); 
var logger = log4js.getLogger( "file-appender" );

exports.errorHandler = function(err, req, res, next) {
    "use strict";
    res.type('application/json'); 
    logger.error(err.message);
    logger.error(err.stack);
    res.status(500);
	res.send({error: {message: err.message}});
}