const Sequelize = require('sequelize');

module.exports = class Training {
	constructor(app) {
		this._app = app;
		this.reset = this._app.config.models.sync;

		this.model = this._app.database.sequelize.define('training', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			volume: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	}
}
