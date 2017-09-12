var log4js = require('log4js'); 
log4js.configure( "./log4js.json" );
var logger = log4js.getLogger( "file-appender" );
logger.setLevel('DEBUG');

exports.httpLogger = function(req, res, next) {

	
	// var acceptsHTML = req.accepts('html');
	// var acceptsJSON = req.accepts('json');

	// if(acceptsHTML)  //will be null if the client does not accept html
	// {
	// 	res.send({error: 'Content type not supported, use Content-Type: application/json'});
	// }

	// if(acceptsJSON){
	   logger.debug("method:" + req.method + 
	   	", IP:" + JSON.stringify(req.ip) +
	   	", path:"+ JSON.stringify(req.path) + 
	   	", headers:" + JSON.stringify(req.headers) + 
	   	", params:" + JSON.stringify(req.params) + 
	   	", body:" + JSON.stringify(req.body) + 
	   	", route:"+ JSON.stringify(req.route)
	   	);

	  next();
	// }
}