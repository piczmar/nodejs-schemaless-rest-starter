var StudentsDAO = require('./dao').StudentsDAO;

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
	"use strict";

	var students = new StudentsDAO(db);

	this.insertEntry = function(req, res, next) {
		"use strict";
		res.type('application/json'); 
	    students.insertEntry(req.body, function(err, inserted) {
	      	"use strict";

	      	if (err) return next(err);

	      	return res.send({studentId: inserted._id});
      	});
      
 	}
 	this.updateEntry = function(req, res, next) {
		"use strict";
		res.type('application/json'); 
	    students.updateEntry(req.body, function(err, updated) {
	      	"use strict";

	      	if (err) return next(err);
	      	
	      	return res.send({studentId: updated._id});
      	});
      
 	}
  this.getAll = function(req, res, next) {
		"use strict";
		res.type('application/json'); 

	  var max = parseInt(req.query.max);
      var limit = max ? max : 10;
      delete req.query.max; // remove max param and use other query params as criteria for search
      var skip = parseInt(req.query.skip);
      var skip = skip ? skip : 0;
      delete req.query.skip; // remove skip param and use other query params as criteria for search

      var criteria = req.query;

      students.getAll(criteria, skip, limit, function(err, items) {
      	"use strict";

      	if (err) return next(err);

      	return res.send(items);
      });
      
  }
}
module.exports = ContentHandler;