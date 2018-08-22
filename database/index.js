const Sequelize = require('sequelize');

class Database {
	constructor(app) {
		this.sequelize = new Sequelize(app.config.database);
		this._app = app;
	}

	connect() {
		var self = this;

		self.sequelize.sync({
		  force: self._app.config.models.sync
		})
		.then(() => {
			console.log('Connected to database');
			if (self._app.config.models.sync) {
				self.init();
			}
		})
		.catch((error) => console.error(error));
	}

	init() {
		var self = this;

		self.createExercises()
		.then(exercises => {
			self.createWorkouts([{
				name: 'Hyperion',
				rounds: [
					[[exercises['burpees'], exercises['crunches'], exercises['squats']], [10, 10, 10]],
					[[exercises['burpees'], exercises['crunches'], exercises['squats']], [20, 20, 20]],
					[[exercises['burpees'], exercises['crunches'], exercises['squats']], [30, 30, 30]],
				]
			}, {
				name: 'Endymion',
				rounds: [
					[[exercises['climbers'], exercises['squats'], exercises['crunches']], [25, 25, 25]],
					[[exercises['climbers'], exercises['squats'], exercises['crunches']], [20, 20, 20]],
					[[exercises['climbers'], exercises['squats'], exercises['crunches']], [15, 15, 15]],
					[[exercises['climbers'], exercises['squats'], exercises['crunches']], [10, 10, 10]],
					[[exercises['climbers'], exercises['squats'], exercises['crunches']], [5, 5, 5]],
				]
			}])
			.then(() => console.log('Workouts created'))
			.catch(error => console.log(error));
		})
		.catch(error => console.log(error));
	}

	createExercises() {
		var self = this;

		return new Promise((resolve, reject) => {
			var exercises = [];

			Promise.all([
				self._app.models.exercise.model.create({ name: 'burpees', points: 6 }),
				self._app.models.exercise.model.create({ name: 'burpee squat jumps', points: 7.5 }),
				self._app.models.exercise.model.create({ name: 'crunches', points: 2.5 }),
				self._app.models.exercise.model.create({ name: 'sit ups', points: 3.5 }),
				self._app.models.exercise.model.create({ name: 'ground twists', points: 2 }),
				self._app.models.exercise.model.create({ name: 'knee push ups', points: 3 }),
				self._app.models.exercise.model.create({ name: 'negative push ups', points: 4 }),
				self._app.models.exercise.model.create({ name: 'incline push ups', points: 4 }),
				self._app.models.exercise.model.create({ name: 'push ups', points: 5 }),
				self._app.models.exercise.model.create({ name: 'spiderman push ups', points: 6 }),
				self._app.models.exercise.model.create({ name: 'diamond push ups', points: 6.5 }),
				self._app.models.exercise.model.create({ name: 'oh push ups', points: 10 }),
				self._app.models.exercise.model.create({ name: 'pull ups', points: 7.5 }),
				self._app.models.exercise.model.create({ name: 'mountain climbers', points: 2 }),
				self._app.models.exercise.model.create({ name: 'climbers', points: 3 }),
				self._app.models.exercise.model.create({ name: 'froggers', points: 4.5 }),
				self._app.models.exercise.model.create({ name: 'heel raises', points: 1.5 }),
				self._app.models.exercise.model.create({ name: 'leg raises', points: 2.5 }),
				self._app.models.exercise.model.create({ name: 'hip raises', points: 3 }),
				self._app.models.exercise.model.create({ name: 'calf raises', points: 3 }),
				self._app.models.exercise.model.create({ name: 'hh lunges', points: 3 }),
				self._app.models.exercise.model.create({ name: 'lunges', points: 4 }),
				self._app.models.exercise.model.create({ name: 'reverse lunges', points: 4 }),
				self._app.models.exercise.model.create({ name: 'split lunges', points: 5 }),
				self._app.models.exercise.model.create({ name: 'hh squats', points: 2.5 }),
				self._app.models.exercise.model.create({ name: 'wide squats', points: 3 }),
				self._app.models.exercise.model.create({ name: 'squats', points: 3.5 }),
				self._app.models.exercise.model.create({ name: 'squat jumps', points: 4 }),
				self._app.models.exercise.model.create({ name: 'shrimp squats', points: 6 }),
				self._app.models.exercise.model.create({ name: 'hh standups', points: 4 }),
				self._app.models.exercise.model.create({ name: 'stand ups', points: 5.5 }),
				self._app.models.exercise.model.create({ name: 'stand up jumps', points: 7.5 }),
				self._app.models.exercise.model.create({ name: 'hight knees', points: 2 }),
				self._app.models.exercise.model.create({ name: 'hight jumps', points: 5 }),
				self._app.models.exercise.model.create({ name: 'jumping jacks', points: 1 }),
				self._app.models.exercise.model.create({ name: 'plank knees to chest', points: 3 }),
				self._app.models.exercise.model.create({ name: 'plank knees to elbow', points: 6 }),
				self._app.models.exercise.model.create({ name: 'plank leg lifts', points: 5 }),
				self._app.models.exercise.model.create({ name: 'plank switches', points: 5 })
			])
			.then(entries => {
				for (var i = 0 ; i < entries.length ; i++) {
					exercises[entries[i].dataValues.name] = entries[i];
				}
				resolve(exercises);
			})
			.catch(error => reject(error));
		});
	}

	updateRound(roundexercise, volume) {
		return new Promise((resolve, reject) => {
			roundexercise.update({ volume: volume })
			.then(res => resolve(res))
			.catch(err => reject(err));
		});
	}

	createRound(exercises, volumes) {
		var self = this;

		return new Promise((resolve, reject) => {
			self._app.models.round.model.create()
			.then(round => {
				round.addExercises(exercises)
				.then(roundexercises => {
					resolve({ round: round, roundexercises: roundexercises });
				})
				.catch(error => reject({ round: null, roundexercises: [] }));
			})
			.catch(error => reject({ round: null, roundexercises: [] }));
		});
	}

	async createRounds(list) {
		var self = this;
		var rounds = [];

		console.log(list.length);
		for (var i = 0 ; i < list.length ; i++) {
			console.log('Creating round : ' + i);
			var exercises = list[i][0];
			var volumes = list[i][1];
			var round = await self.createRound(exercises, volumes);

			if (round.round) {
				rounds.push(round.round);
				for (var j = 0 ; j < round.roundexercises[0].length ; j++) {
					console.log('Updating roundexercise : ' + j);
					await self.updateRound(round.roundexercises[0][j], volumes[j]);
				}
			}
		}

		return rounds;
	}

	updateWorkout(workout, rounds) {
		return new Promise((resolve, reject) => {
			workout.addRounds(rounds)
			.then(workout => resolve(workout))
			.catch(error => reject(error));
		});
	}

	createWorkout(name) {
		var self = this;

		return new Promise((resolve, reject) => {
			self._app.models.workout.model.create({
				name: name
			})
			.then(workout => resolve(workout))
			.catch(error => reject(error));
		});
	}

	async createWorkouts(workouts) {
		var self = this;

		for (var i = 0 ; i < workouts.length ; i++) {
			console.log('Creating workout : ' + workouts[i].name);
			var workout = await self.createWorkout(workouts[i].name);
			var rounds = await self.createRounds(workouts[i].rounds);
			await self.updateWorkout(workout, rounds);
		}

		return Promise.resolve();
	}
}

module.exports = Database;
