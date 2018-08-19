const Sequelize = require('sequelize');

module.exports = class Exercise {
	constructor(app) {
		this._app = app;
		this.reset = this._app.config.models.sync;

		this.model = this._app.database.sequelize.define('exercise', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				required: true
			},
			points: {
				type: Sequelize.FLOAT,
				allowNull: false,
				required: true
			},
			difficulty: {
				type: Sequelize.ENUM('easy', 'medium', 'hard', 'hardcore'),
				allowNull: false,
				required: true
			},
			body: {
				type: Sequelize.ENUM('Body', 'Legs', 'Arms', 'Back', 'Abdominals', 'Shoulders'),
				allowNull: true,
				defaultValue: null
			},
			equipment: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: null
			}
		});

		this.model.sync({
			force: this.reset
		});
	}
}
