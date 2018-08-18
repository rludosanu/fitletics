(function() {
	var app = angular.module('my-app', ['ngCookies']);

	var exercises = {
		burpees: {
			name: 'Burpees',
			points: 5,
			difficulty: 'medium',
			body: 'Full body'
		},
		squats: {
			name: 'Squats',
			points: 2,
			difficulty: 'medium',
			body: 'Legs'
		},
		situps: {
			name: 'Situps',
			points: 3,
			difficulty: 'medium',
			body: 'Core'
		}
	};

	var workouts = {
		aphrodite: {
			name: 'Aphrodite',
			body: 'Lower Body',
			duration: '30:00',
			difficulty: 'Medium',
			equipment: 'None',
			sets: [[
				{ name: 'Burpees', repetition: 50 },
				{ name: 'Squats', repetition: 50 },
				{ name: 'Situps', repetition: 50 }
			], [
				{ name: 'Burpees', repetition: 40 },
				{ name: 'Squats', repetition: 40 },
				{ name: 'Situps', repetition: 40 }
			], [
				{ name: 'Burpees', repetition: 30 },
				{ name: 'Squats', repetition: 30 },
				{ name: 'Situps', repetition: 30 }
			], [
				{ name: 'Burpees', repetition: 20 },
				{ name: 'Squats', repetition: 20 },
				{ name: 'Situps', repetition: 20 }
			], [
				{ name: 'Burpees', repetition: 10 },
				{ name: 'Squats', repetition: 10 },
				{ name: 'Situps', repetition: 10 }
			]]
		},
		persephone: {
			name: 'Persephone',
			body: 'Full Body',
			duration: '15:00',
			difficulty: 'Hard',
			equipment: 'None',
			sets: [[
				{ name: 'Burpees', repetition: 50 },
				{ name: 'Pullups', repetition: 50 },
				{ name: 'Pushups', repetition: 100 },
				{ name: 'Squats', repetition: 150 },
				{ name: 'Burpees', repetition: 50 }
			]]
		},
		morpheus: {
			name: 'Morpheus',
			body: 'Arms, Shoulders',
			duration: '08:00',
			difficulty: 'Medium',
			equipment: 'None',
			sets: [[
				{ name: 'Burpees', repetition: 25 },
				{ name: 'Pullups', repetition: 15 },
				{ name: 'Pushups', repetition: 25 },
				{ name: 'Squats', repetition: 50 },
			], [
				{ name: 'Burpees', repetition: 25 },
				{ name: 'Pullups', repetition: 15 },
				{ name: 'Pushups', repetition: 25 },
				{ name: 'Squats', repetition: 50 },
			], [
				{ name: 'Burpees', repetition: 25 },
				{ name: 'Pullups', repetition: 15 },
				{ name: 'Pushups', repetition: 25 },
				{ name: 'Squats', repetition: 50 },
			]]
		}
	};

	app.controller('index', function($scope, $cookies) {
		var allowFullscreen = $cookies.get('allowFullscreen');

		var launchFullscreen = function() {
			document.documentElement.requestFullscreen = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.msRequestFullscreen;
			document.exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozExitFullscreen || document.msExitFullscreen;
			document.documentElement.requestFullscreen(document.documentElement);
		};

		$scope.allowFullscreen = allowFullscreen;

		$scope.rejectFullscreen = function() {
			$scope.allowFullscreen = false;
			$cookies.put('allowFullscreen', false);
		};

		$scope.acceptFullscreen = function() {
			$scope.allowFullscreen = true;
			$cookies.put('allowFullscreen', true);
			launchFullscreen();
		};
	});

	app.controller('workoutList', function($scope) {
		var workoutNames = Object.keys(workouts);

		$scope.workouts = [];
		for (var i = 0 ; i < workoutNames.length ; i++) {
			$scope.workouts.push({
				name: workouts[workoutNames[i]].name,
				body: workouts[workoutNames[i]].body,
				duration: workouts[workoutNames[i]].duration,
				difficulty: workouts[workoutNames[i]].difficulty
			});
		}
	});

	app.controller('workoutPreview', function($scope, $location) {
		var url = $location.absUrl().split('/');
		var workout = workouts[url[url.length - 2]];

		$scope.workout = {
			name: workout.name,
			equipment: workout.equipment,
			duration: workout.duration,
			sets: workout.sets
		};
	});

	app.controller('workoutLive', function($scope, $interval, $window, $location) {
		var url = $location.absUrl().split('/');
		var workout = workouts[url[url.length - 2]];

		$scope.workout = {
			name: workout.name,
			currentSet: 0,
			currentExercise: 0,
			exercise: null,
			completionPercentage: 0,
			sets: workout.sets,
			updateExercice() {
				var self = this;
				var tmp = 0;

				for (var i = 0 ; i < self.sets.length ; i++) {
					for (var j = 0 ; j < self.sets[i].length ; j++) {
						if (tmp == self.currentExercise) {
							self.exercise = self.sets[i][j];
							self.currentSet = i + 1;
							return ;
						} else {
							tmp += 1;
						}
					}
				}
			},
			nextExercice() {
				var self = this;
				var total = 0;

				for (var i = 0 ; i < self.sets.length ; i++) {
					for (var j = 0 ; j < self.sets[i].length ; j++) {
						total++;
					}
				}

				if (self.currentExercise == total - 1) {
					self.currentExercise++;
					return 1;
				} else {
					self.currentExercise++;
					return 0;
				}
			},
			updatePercentage() {
				var self = this;
				var total = 0;

				for (var i = 0 ; i < self.sets.length ; i++) {
					for (var j = 0 ; j < self.sets[i].length ; j++) {
						total++;
					}
				}

				self.completionPercentage = Math.floor((self.currentExercise * 100) / total);
			},
			getMaxRepetition() {
				var self = this;
				var max = 0;

				for (var i = 0 ; i < self.sets.length ; i++) {
					for (var j = 0 ; j < self.sets[i].length ; j++) {
						var repetition = self.sets[i][j].repetition;

						if (repetition >= max)
							max = repetition;
					}
				}
				return max;
			},
			giveUp() {

			}
		};

		$scope.barchart = {
			maxHeight: 100,
			width: 24,
			frontColor: '#3B7FF1',
			backgroundColor: '#292929',
			textColor: 'white',
			maxRepetition: $scope.workout.getMaxRepetition(),
			isDoneCSS(set, exercise) {
				var self = this;
				var tmp = 0;

				for (var i = 0 ; i < $scope.workout.sets.length ; i++) {
					for (var j = 0 ; j < $scope.workout.sets[i].length ; j++) {
						if (set == i && exercise == j && tmp < $scope.workout.currentExercise) {
							return self.frontColor;
						}
						tmp++;
					}
				}
				return self.backgroundColor;
			}
		};

		$scope.buttonText = 'Start';

		// App timer
		$scope.timer = {
			counter: 0,
			timer: '00:00',
			handle: null,
			updateHMS() {
				var self = this;
				var sec_num = parseInt(self.counter, 10);
				var hours = Math.floor(sec_num / 3600);
				var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
				var seconds = sec_num - (hours * 3600) - (minutes * 60);

				if (hours < 10)
					hours = '0' + hours;
				if (minutes < 10)
					minutes = '0' + minutes;
				if (seconds < 10)
					seconds = '0' + seconds;
				if (hours == 0)
					self.timer = minutes + ':' + seconds;
				else
					self.timer = hours + ':' + minutes + ':' + seconds;
			},
			start() {
				var self = this;

				if (self.handle)
					return ;
				self.timer = '00:00';
				self.handle = $interval(function() {
					self.counter += 1;
					self.updateHMS();
				}, 1000);
			},
			stop() {
				var self = this;

				$interval.cancel(self.handle);
				self.handle = null;
				self.counter = 0;
			}
		};

		// App state
		$scope.state = {
			state: 'waiting',
			giveup: false,
			fullscreen: false,
			update() {
				var self = this;

				if (self.state == 'waiting') {
					$scope.timer.start();
					$scope.buttonText = 'Next';
					self.state = 'ongoing';
				} else if (self.state == 'ongoing') {
					if ($scope.workout.nextExercice() == 1) {
						$scope.timer.stop();
						$scope.buttonText = 'Finish';
						self.state = 'finished';
					}
					$scope.workout.updatePercentage();
					$scope.workout.updateExercice();
				} else if (self.state == 'finished') {
					$window.location.href = '/workout/';
				}
			},
			toggleFullscreen() {
				console.log('toggleFullscreen');
				var self = this;

				document.documentElement.requestFullscreen = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.msRequestFullscreen;
				document.exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozExitFullscreen || document.msExitFullscreen;

				if (self.fullscreen == true) {
					document.exitFullscreen(document);
					self.fullscreen = false;
				} else {
					document.documentElement.requestFullscreen(document.documentElement);
					self.fullscreen = true;
				}
			}
		};

		// On load update current displayed exercise
		$scope.workout.updateExercice();
	});

	app.controller('exerciseList', function($scope) {
		var exerciseNames = Object.keys(exercises);

		$scope.exercises = [];
		for (var i = 0 ; i < exerciseNames.length ; i++) {
			$scope.exercises.push({
				name: exercises[exerciseNames[i]].name,
				points: exercises[exerciseNames[i]].points,
				body: exercises[exerciseNames[i]].body,
				difficulty: exercises[exerciseNames[i]].difficulty
			});
		}
	});
})();
