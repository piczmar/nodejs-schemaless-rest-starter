var ContentHandler = require('./content')
, ErrorHandler = require('../../error').errorHandler;

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);

    // The main page of the blog
    //app.get('/', contentHandler.showMainPage);

    app.get('/api/students', contentHandler.getAll);
    app.post('/api/students', contentHandler.insertEntry);
	app.put('/api/students', contentHandler.updateEntry);
}