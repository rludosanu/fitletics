(function() {
	var app = angular.module('my-app', ['ngCookies']);

	/*
	** List of all available exercises.
	*/
	app.controller('exerciseList', function($scope, $http) {
		$scope.exercises = [];

		$http({
			method: 'POST',
			url: 'http://192.168.1.26:3000/api/exercise'
		})
		.then(result => {
			console.log(result);
			$scope.exercises = result.data;
		})
		.catch(error => {
			console.error(error);
		});
	});

	/*
	** Exercise preview.
	*/
	app.controller('exercisePreview', function($scope, $http, $location, $window) {
		var url = $location.absUrl().split('/');
		var id = url[url.length - 2];

		$scope.exercise = {
			id: 0,
			name: '',
			points: 0
		};

		$scope.volume = 10;

		$scope.start = function() {
			$window.location.href = '/exercise/' + $scope.exercise.id + '/live/' + $scope.volume;
		};

		$http({
			method: 'POST',
			url: 'http://192.168.1.26:3000/api/exercise/' + id
		})
		.then(result => {
			console.log(result);
			$scope.exercise = result.data;
		})
		.catch(error => {
			console.error(error);
		});
	});

	/*
	** Live exercise training session.
	*/
	app.controller('exerciseLive', function($scope, $interval, $window, $location, $http) {
		var url = $location.absUrl().split('/');
		var volume = url[url.length - 1];
		var id = url[url.length - 3];

		$scope.exercise = {
			id: -1,
			name: '',
			volume: volume
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

					$http({
						method: 'POST',
						url: 'http://192.168.1.26:3000/api/training/create',
						data: {
							exerciseId: parseInt(id),
							volume: parseInt(volume)
						}
					})
					.then(result => {
						$window.location.href = '/user/profile';
					})
					.catch(error => console.error(error));
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

		$http({
			method: 'POST',
			url: 'http://192.168.1.26:3000/api/exercise/' + id
		})
		.then(result => {
			console.log(result);
			$scope.exercise.id = result.data.id;
			$scope.exercise.name = result.data.name;
		})
		.catch(error => console.error(error));
	});

})();
