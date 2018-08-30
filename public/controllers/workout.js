(function() {
	var app = angular.module('my-app', ['ngCookies']);

	/*****************************************************************************
  **
  ** Parse script tag to get server host and port.
  **
  *****************************************************************************/
  var getAppScriptAttributes = function(attrname) {
    var scripts = document.getElementsByTagName('script');
    var attrval = null;

    for (var i = 0 ; i < scripts.length ; i++) {
      attrval = scripts[i].getAttribute(attrname);
      if (attrval)
        return attrval;
    }
  };

  var appHost = getAppScriptAttributes('app-host');
  var appPort = getAppScriptAttributes('app-port');
  var appAddr = appHost + ':' + appPort;

	/*****************************************************************************
  **
  ** List of all workouts
  **
  *****************************************************************************/
	app.controller('workoutList', function($scope, $http) {
		$scope.workouts = [];
		$scope.workoutRounds = 0;

		$http({
			method: 'POST',
			url: 'http://' + appAddr + '/api/workout/'
		})
		.then(result => {
			$scope.workouts = result.data;
		})
		.catch(error => {
			console.error(error);
		});
	});

	/*****************************************************************************
	**
	** Preview of a workout.
	**
	*****************************************************************************/
	app.controller('workoutPreview', function($scope, $http, $location, $window) {
		var url = $location.absUrl().split('/');
		var id = url[url.length - 2];

		function getMaxVolume() {
			var max = 0;

			for (var i = 0 ; i < $scope.workout.rounds.length ; i++) {
				for (var j = 0 ; j < $scope.workout.rounds[i].length ; j++) {
					var volume = $scope.workout.rounds[i][j].volume;

					if (volume >= max)
						max = volume;
				}
			}
			return max;
		}

		$scope.start = function() {
			$window.location.href = '/workout/' + id + '/live';
		};

		$scope.workout = {};

		$scope.barchart = {
			maxHeight: 100,
			width: 24,
			maxVolume: 0
		};

		$http({
			method: 'POST',
			url: 'http://' + appAddr + '/api/workout/' + id
		})
		.then(result => {
			$scope.workout = result.data;
			$scope.barchart.maxVolume = getMaxVolume();
		})
		.catch(error => {
			console.error(error);
		});
	});

	/*****************************************************************************
	**
	** Run a workout as a training.
	**
	*****************************************************************************/
	app.controller('workoutLive', function($scope, $interval, $window, $location, $http) {
		var url = $location.absUrl().split('/');
		var id = url[url.length - 2];
		var workout = null;
		var trainingId = null;

		// Find workout
		$http({
			method: 'POST',
			url: 'http://' + appAddr + '/api/workout/' + id
		})
		.then(result => {
			workout = result.data;

			// Create training
			$http({
				method: 'POST',
				url: 'http://' + appAddr + '/api/training/create',
				data: {
					workoutId: parseInt(id),
					volume: 1
				}
			})
			.then(result => {
				trainingId = result.data;
			})
			.catch(error => {
				console.error(error);
			});

			$scope.workout = {
				id: workout.id,
				name: workout.name,
				currentRound: 0,
				currentExercise: 0,
				exercise: null,
				completionPercentage: 0,
				rounds: workout.rounds,
				updateExercice() {
					var self = this;
					var tmp = 0;

					for (var i = 0 ; i < self.rounds.length ; i++) {
						for (var j = 0 ; j < self.rounds[i].length ; j++) {
							if (tmp == self.currentExercise) {
								self.exercise = self.rounds[i][j];
								self.currentRound = i + 1;
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

					for (var i = 0 ; i < self.rounds.length ; i++) {
						for (var j = 0 ; j < self.rounds[i].length ; j++) {
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

					for (var i = 0 ; i < self.rounds.length ; i++) {
						for (var j = 0 ; j < self.rounds[i].length ; j++) {
							total++;
						}
					}

					self.completionPercentage = Math.floor((self.currentExercise * 100) / total);
				},
				getMaxRepetition() {
					var self = this;
					var max = 0;

					for (var i = 0 ; i < self.rounds.length ; i++) {
						for (var j = 0 ; j < self.rounds[i].length ; j++) {
							var volume = self.rounds[i][j].volume;

							if (volume >= max)
								max = volume;
						}
					}
					return max;
				}
			};

			$scope.barchart = {
				maxHeight: 100,
				width: 24,
				frontColor: '#3B7FF1',
				backgroundColor: '#292929',
				textColor: 'white',
				maxRepetition: $scope.workout.getMaxRepetition(),
				isDoneCSS(round, exercise) {
					var self = this;
					var tmp = 0;

					for (var i = 0 ; i < $scope.workout.rounds.length ; i++) {
						for (var j = 0 ; j < $scope.workout.rounds[i].length ; j++) {
							if (round == i && exercise == j && tmp < $scope.workout.currentExercise) {
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
				update() {
					var self = this;

					if (self.state == 'waiting') {
						$scope.timer.start();
						$scope.buttonText = 'Next';
						self.state = 'ongoing';

						$http({
							method: 'PUT',
							url: 'http://' + appAddr + '/api/training/start',
							data: {
								trainingId: trainingId
							}
						})
						.then(result => {
							console.log(result);
						})
						.catch(error => {
							console.error(error);
						});

					} else if (self.state == 'ongoing') {
						if ($scope.workout.nextExercice() == 1) {
							$scope.timer.stop();
							$scope.buttonText = 'Finish';
							self.state = 'finished';
						}
						$scope.workout.updatePercentage();
						$scope.workout.updateExercice();
					} else if (self.state == 'finished') {
						$http({
							method: 'PUT',
							url: 'http://' + appAddr + '/api/training/finish',
							data: {
								trainingId: trainingId
							}
						})
						.then(result => {
							console.log(result);
							$window.location.href = '/user/profile';
						})
						.catch(error => {
							console.error(error);
						});
					}
				}
			};

			// On load update current displayed exercise
			$scope.workout.updateExercice();
		})
		.catch(error => {
			console.error(error);
		});
	});
})();
