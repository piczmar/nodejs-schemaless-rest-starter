var ContentHandler = require('./content')
, ErrorHandler = require('../../error').errorHandler;

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);

    app.get('/api/groups', contentHandler.getAll);
    app.get('/api/groups/:groupId/students', contentHandler.getMatchingStudents);
	app.get('/api/groups/matching/:studentId', contentHandler.getMatching); // get all groups where a student is active
    app.post('/api/groups', contentHandler.insertEntry);

    

}