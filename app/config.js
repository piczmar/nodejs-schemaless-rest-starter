var config = {}
console.log('NRS_ENV = ' + process.env.NRS_ENV);
if (process.env.NRS_ENV == 'DEV') {
	config.db_user = 'nodejs',
	config.db_pass = 'nodejs',
	config.db_host = '10.90.20.14',
	config.db_port = '27017',
	config.server = {
		port : {
			http : '80',
			https : '443'
		}
	}
} else if (process.env.NRS_ENV == 'DOCKER') {
	config.db_user = 'nodejs',
	config.db_pass = 'nodejs',
	config.db_host = '172.17.0.1',
	config.db_port = '27017',
	config.server = {
		port : {
			http : '9000',
			https : '9443'
		}
	}
} else {
	config.db_user = 'nodejs',
	config.db_pass = 'nodejs',
	config.db_host = 'localhost',
	config.db_port = '27017',
	config.server = {
		port : {
			http : '9000',
			https : '9443'
		}
	}
}
config.DBNAME = 'test';
config.MONGO = 'mongodb://' + config.db_user + ':'
	+ config.db_pass + '@'
	+ config.db_host + ':'
	+ config.db_port + '/'
	+ config.DBNAME
	+ "?authMechanism=DEFAULT"
module.exports = config;