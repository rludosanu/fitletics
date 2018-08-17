(function() {
	var app = angular.module('app', []);

	app.controller('userCreate', function($scope, $http, $window, $location) {
		$scope.user = {
			email: '',
			password: ''
		};

		$scope.submit = function() {
			$http({
				method: 'POST',
				url: 'https://localhost/api/user',
				data: {
					email: $scope.user.email,
					password: $scope.user.password
				}
			})
			.then((result) => console.log(result))
			.catch((error) => console.log(error));
		};
  });
})();
