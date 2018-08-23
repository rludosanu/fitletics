const fs = require('fs');
const path = require('path');

module.exports = class Models {
	constructor(app) {
		// Load models
		var models = fs.readdirSync(__dirname).filter(file => path.parse(__filename).name !== path.parse(file).name).map(file => path.parse(file).name);

		// Instanciate models
		for (let i = 0 ; i < models.length ; i++) {
			let model = require('./' + models[i]);

			this[models[i]] = new model(app);
		}

		// Create associations
		this.workout.model.hasMany(this.round.model);
		this.round.model.belongsToMany(this.exercise.model, { through: 'roundexercise', foreignKey: 'roundId' });
		this.exercise.model.belongsToMany(this.round.model, { through: 'roundexercise', foreignKey: 'exerciseId' });

		this.exercise.model.belongsToMany(this.training.model, { through: 'trainingexercise', foreignKey: 'exerciseId' });
		this.training.model.belongsToMany(this.exercise.model, { through: 'trainingexercise', foreignKey: 'trainingId' });

		this.workout.model.belongsToMany(this.training.model, { through: 'trainingworkout', foreignKey: 'workoutId' });
		this.training.model.belongsToMany(this.workout.model, { through: 'trainingworkout', foreignKey: 'trainingId' });
	}
}
