(function() {
	var app = angular.module('my-app', []);

	app.controller('workoutList', function($scope, $http, $window, $location) {
		$scope.workouts = [{
			thumbnail: 'http://img.app-liv.jp.s3.amazonaws.com/icon/654810212/a2e9fc63ac821569853c1604232a718c.png',
			name: 'Hyperion',
			body: 'Lower Body',
			duration: '30 min',
			difficulty: 'Medium'
		}, {
			thumbnail: 'http://img.app-liv.jp.s3.amazonaws.com/icon/654810212/a2e9fc63ac821569853c1604232a718c.png',
			name: 'Persephone',
			body: 'Full Body',
			duration: '8 min',
			difficulty: 'Hard'
		}, {
			thumbnail: 'http://img.app-liv.jp.s3.amazonaws.com/icon/654810212/a2e9fc63ac821569853c1604232a718c.png',
			name: 'Morpheus',
			body: 'Arms, Shoulders',
			duration: '15 min',
			difficulty: 'Medium'
		}, {
			thumbnail: 'http://img.app-liv.jp.s3.amazonaws.com/icon/654810212/a2e9fc63ac821569853c1604232a718c.png',
			name: 'Nyx',
			body: 'Full Body',
			duration: '45 min',
			difficulty: 'Hard'
		}]
	});

	app.controller('workoutPreview', function($scope, $http, $window, $location) {
		var thumb = 'http://img.app-liv.jp.s3.amazonaws.com/icon/654810212/a2e9fc63ac821569853c1604232a718c.png';

		$scope.workout = {
			name: 'Hyperion',
			sets: [[
				{ thumbnail: thumb, name: 'Burpees', repetition: 50 },
				{ thumbnail: thumb, name: 'Squats', repetition: 50 },
				{ thumbnail: thumb, name: 'Situps', repetition: 50 }
			], [
				{ thumbnail: thumb, name: 'Burpees', repetition: 30 },
				{ thumbnail: thumb, name: 'Squats', repetition: 30 },
				{ thumbnail: thumb, name: 'Situps', repetition: 30 }
			], [
				{ thumbnail: thumb, name: 'Burpees', repetition: 10 },
				{ thumbnail: thumb, name: 'Squats', repetition: 10 },
				{ thumbnail: thumb, name: 'Situps', repetition: 10 }
			]]
		};
	});
})();
