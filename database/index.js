const Sequelize = require('sequelize');

class Database {
	constructor(app) {
		this.sequelize = new Sequelize(app.config.database);
	}

	connect() {
		this.sequelize.authenticate()
		.then(() => console.log('Connected to database'))
		.catch((error) => console.error(error));
	}
}

module.exports = Database;
