(function() {
  var app = angular.module('my-app', ['ngCookies']);

  /*
  ** Signin
  */
  app.controller('userSignin', function($scope, $http, $window, $cookies) {
    $scope.user = {
      username: 'rludosanu',
      password: 'ludosanu'
    };

    $scope.validation = {
      display: false,
      title: '',
      context: ''
    };

    $scope.signin = function() {
      $http({
        method: 'POST',
        url: 'http://192.168.1.26:3000/api/user/signin',
        data: {
          username: $scope.user.username,
          password: $scope.user.password,
        }
      })
      .then((result) => {
        console.log(result);

        $scope.validation = {
          display: true,
          title: 'Success',
          context: result.data.token
        };

        $scope.user = {
          username: '',
          password: ''
        };
      })
      .catch((error) => {
        console.error(error);

        $scope.validation = {
          display: true,
          title: 'Error',
          context: error.data.error
        };
      });
    }
  });

  /*
  ** Signup
  */
  app.controller('userSignup', function($scope, $http, $window) {
    $scope.user = {
      firstName: 'Razvan',
      lastName: 'Ludosanu',
      username: 'rludosanu',
      email: 'r.ludosanu@gmail.com',
      password: 'ludosanu'
    };

    $scope.validation = {
      display: false,
      title: '',
      context: ''
    };

    $scope.signup = function() {
      $http({
        method: 'POST',
        url: 'http://192.168.1.26:3000/api/user/signup',
        data: {
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          username: $scope.user.username,
          email: $scope.user.email,
          password: $scope.user.password
        }
      })
      .then((result) => {
        console.log(result);

        $scope.validation = {
          display: true,
          title: 'Account created',
          context: result.data.success
        };

        $scope.user = {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: ''
        };
      })
      .catch((error) => {
        console.error(error);

        $scope.validation = {
          display: true,
          title: 'Form error',
          context: error.data.error
        };
      });
    }
  });

  /*
  ** Reset
  */
  app.controller('userReset', function($scope, $http, $window, $cookies) {
    $scope.user = {
      email: 'r.ludosanu@gmail.com'
    };

    $scope.validation = {
      display: false,
      title: '',
      context: ''
    };

    $scope.reset = function() {
      $http({
        method: 'PUT',
        url: 'http://192.168.1.26:3000/api/user/reset',
        data: {
          email: $scope.user.email
        }
      })
      .then((result) => {
        console.log(result);

        $scope.validation = {
          display: true,
          title: 'Password reset',
          context: 'Your password has been reset. Check your emails.'
        };

        $scope.user = {
          email: ''
        };
      })
      .catch((error) => {
        console.error(error);

        $scope.validation = {
          display: true,
          title: 'Reset error',
          context: 'Internal database error or user email doesn\'t exist.'
        };
      });
    }
  });

  /*
  ** Toggle menu
  */
  app.controller('userMenu', function($scope) {
    $scope.menu = {
      display: false,
      toggle: function() {
        this.display = !this.display;
      }
    };
  });
})();
