(function() {
	var app = angular.module('my-app', ['ngCookies']);

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

	app.controller('exercisePreview', function($scope, $location) {
		var url = $location.absUrl().split('/');
		var exercise = exercises[url[url.length - 2]];

		$scope.exercise = {
			name: exercise.name,
			points: exercise.points,
			difficulty: exercise.difficulty,
			equipment: exercise.equipment.join(', '),
			body: exercise.body.join(', ')
		};

		$scope.repetitions = 0;
	});

	app.controller('exerciseLive', function($scope, $interval, $window, $location) {
		var url = $location.absUrl().split('/');
		var repetitions = url[url.length - 1];
		var exercise = exercises[url[url.length - 3]];

		$scope.exercise = {
			name: exercise.name,
			repetitions: repetitions
		};

		$scope.state = {
			giveup: false
		};

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

		$scope.buttonText = 'Start';

		$scope.state = {
			state: 'waiting',
			giveup: false,
			fullscreen: false,
			update() {
				var self = this;

				if (self.state == 'waiting') {
					$scope.timer.start();
					$scope.buttonText = 'Finish';
					self.state = 'ongoing';
				} else if (self.state == 'ongoing') {
					$scope.timer.stop();
					$window.location.href = '/exercise/';
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
	});
})();
