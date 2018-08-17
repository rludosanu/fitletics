const Sequelize = require('sequelize');

module.exports = class User {
	constructor(app) {
		this._app = app;
		this.reset = this._app.config.models.sync;

		this.model = this._app.database.sequelize.define('user', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				required: true
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				required: true
			}
		});

		this.model.sync({
			force: this.reset
		});
	}
}