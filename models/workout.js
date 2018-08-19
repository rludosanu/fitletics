const Sequelize = require('sequelize');

module.exports = class Workout {
	constructor(app) {
		this._app = app;
		this.reset = this._app.config.models.sync;

		this.model = this._app.database.sequelize.define('workout', {
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
      duration: {
				type: Sequelize.INTEGER,
				allowNull: false,
				required: true
      },
      sets: {
      	type: Sequelize.JSON,
				allowNull: false,
				required: true
      }
		});

		this.model.sync({
			force: this.reset
		});
	}
}
