var GroupsDAO = require('./dao').GroupsDAO;

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
	"use strict";

	var groups = new GroupsDAO(db);

	this.insertEntry = function(req, res, next) {
		"use strict";

		res.type('application/json'); 

      groups.insertEntry(req.body, function(err, inserted) {
      	"use strict";

      	if (err) return next(err);

      	return res.send({groupId: inserted._id});
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
    groups.getAll(criteria, skip, limit, function(err, items) {
    	"use strict";

    	if (err) return next(err);

    	return res.send(items);
    });
      
  }
  this.getMatching = function(req, res, next) {
    "use strict";
    res.type('application/json'); 

    var max = parseInt(req.query.max);
    var limit = max ? max : 10;
    delete req.query.max; // remove max param and use other query params as criteria for search
    var skip = parseInt(req.query.skip);
    var skip = skip ? skip : 0;
    delete req.query.skip; // remove skip param and use other query params as criteria for search

    groups.getMatching(req.params.studentId, skip, limit, function(err, items) {
      "use strict";

      if (err) return next(err);

      return res.send(items);
    });
      
  }
  this.getMatchingStudents = function(req, res, next) {
    "use strict";
    res.type('application/json'); 

      var max = parseInt(req.query.max);
      var limit = max ? max : 10;
      groups.getMatchingStudents(req.params.groupId, limit, function(err, items) {
        "use strict";

        if (err) return next(err);

        return res.send(items);
      });  
  };
}
module.exports = ContentHandler;