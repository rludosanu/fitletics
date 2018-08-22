const Sequelize = require('sequelize');

module.exports = class Round {
	constructor(app) {
		this._app = app;
		this.reset = this._app.config.models.sync;

		this.model = this._app.database.sequelize.define('round', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true
			}
		});

		// this.model.sync({
		// 	force: this.reset
		// });
	}
}
