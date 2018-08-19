const Sequelize = require('sequelize');

body: ['Full body'],
equipment: []

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
				allowNull: true,
				defaultValue: null
			},
			workoutId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				defaultValue: null
			},
			exerciseId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				defaultValue: null
			},
			volume: {
				type: Sequelize.INTEGER,
				allowNull: false,
				required: true
			},
			datetime: {
				type: Sequelize.DATE,
				allowNull: false,
				required: true,
				defaultValue: Sequelize.NOW
			}
		});

		this.model.sync({
			force: this.reset
		});
	}
}
