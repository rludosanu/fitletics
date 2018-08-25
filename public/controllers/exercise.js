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
  ** List of all exercises
  **
  *****************************************************************************/
	app.controller('exerciseList', function($scope, $http) {
		/* Exercises list */
		$scope.exercises = [];

		/* Request list to API */
		$http({
			method: 'POST',
			url: 'http://' + appAddr + '/api/exercise'
		})
		.then(result => {
			$scope.exercises = result.data;
		})
		.catch(error => {
			console.error(error);
		});
	});

	/*****************************************************************************
  **
  ** Preview one exercise
  **
  *****************************************************************************/
	app.controller('exercisePreview', function($scope, $http, $location, $window) {
		/* Parse url to get exercise id */
		var url = $location.absUrl().split('/');
		var exerciseId = url[url.length - 2];

		/* Exercise informations */
		$scope.exercise = {
			id: -1,
			name: '',
			points: 0
		};

		/* Exercise volume */
		$scope.volume = 10;

		/* Redirect to exercise training page */
		$scope.start = function() {
			$window.location.href = '/exercise/' + $scope.exercise.id + '/live/' + $scope.volume;
		};

		/* Request informations to API */
		$http({
			method: 'POST',
			url: 'http://' + appAddr + '/api/exercise/' + exerciseId
		})
		.then(result => {
			$scope.exercise = result.data;
		})
		.catch(error => {
			console.error(error);
		});
	});

	/*****************************************************************************
  **
  ** Run one exercise as a training
  **
  *****************************************************************************/
	app.controller('exerciseLive', function($scope, $interval, $window, $location, $http) {
		/* Parse url to get exercise id and volume */
		var url = $location.absUrl().split('/');
		var exerciseId = url[url.length - 3];
		var exerciseVolume = url[url.length - 1];

		/* Exercise informations */
		$scope.exercise = {
			id: exerciseId,
			name: '',
			volume: exerciseVolume
		};

		/* Training timer */
		$scope.timer = {
			counter: 0,
			timer: '00:00',
			handle: null,
			/* Converts a number to a time format */
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
			/* Start the timer */
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
			/* Stop the timer */
			stop() {
				var self = this;

				$interval.cancel(self.handle);
				self.handle = null;
				self.counter = 0;
			}
		};

		$scope.buttonText = 'Start';

		/* General state */
		$scope.state = {
			state: 'waiting',
			giveup: false,
			update() {
				var self = this;

				if (self.state == 'waiting') {
					$scope.timer.start();
					$scope.buttonText = 'Finish';
					self.state = 'ongoing';
				} else if (self.state == 'ongoing') {
					$scope.timer.stop();

					/* Create a new training */
					$http({
						method: 'POST',
						url: 'http://' + appAddr + '/api/training/create',
						data: {
							exerciseId: parseInt(exerciseId),
							volume: parseInt(exerciseVolume)
						}
					})
					.then(result => {
						$window.location.href = '/user/profile';
					})
					.catch(error => console.error(error));
				}
			}
		};

		/* Get exercise informations */
		$http({
			method: 'POST',
			url: 'http://' + appAddr + '/api/exercise/' + exerciseId
		})
		.then(result => {
			$scope.exercise.name = result.data.name;
		})
		.catch(error => console.error(error));
	});

})();
