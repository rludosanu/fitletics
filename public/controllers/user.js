(function() {
  var app = angular.module('my-app', ['ngCookies']);

  // Make cookies global over the domain
  app.config(function($cookiesProvider) {
    $cookiesProvider.defaults.path = '/';
    $cookiesProvider.defaults.domain = '192.168.1.26';
  });

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
        $cookies.put('token', result.data.token);
        $window.location.href = '/dashboard';
      })
      .catch((error) => {
        $scope.validation = {
          display: true,
          title: 'Error',
          context: error.data.error
        };
      });
    }
  });

  /*
  ** Signout
  */
  app.controller('userSignout', function($scope, $window, $cookies) {
    var cookies = $cookies.getAll();
    var total = Object.keys(cookies).length;
    var current = 0;

    $scope.signout = function() {
      angular.forEach(cookies, function (v, k) {
        $cookies.remove(k);
        current++;
        if (current == total) {
          $window.location.href = '/';
        }
      });
    };
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
  ** Update
  */
  app.controller('userUpdate', function($scope, $http, $window, $cookies) {
    $scope.user = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    };

    $http({
      method: 'POST',
      url: 'http://192.168.1.26:3000/api/user/read'
    })
    .then((result) => {
      console.log(result);

      $scope.user = {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        username: result.data.username,
        email: result.data.email
      };
    })
    .catch((error) => {
      console.error(error);
    });

    $scope.update = function() {
      $http({
        method: 'PUT',
        url: 'http://192.168.1.26:3000/api/user/update',
        data: {
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          username: $scope.user.username,
          email: $scope.user.email,
          password: $scope.user.password
        }
      })
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.error(error.data.error);
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
