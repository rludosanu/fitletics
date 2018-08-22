const Sequelize = require('sequelize');

module.exports = class Roundexercise {
	constructor(app) {
		this._app = app;
		this.reset = this._app.config.models.sync;

		this.model = this._app.database.sequelize.define('roundexercise', {
      roundId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      exerciseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      volume: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      }
    });

    // this.model.sync({
		// 	force: this.reset
		// });
	}
}
