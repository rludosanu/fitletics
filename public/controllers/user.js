(function() {
  var app = angular.module('my-app', ['ngCookies']);

  // Make cookies global over the domain
  app.config(function($cookiesProvider) {
    $cookiesProvider.defaults.path = '/';
    $cookiesProvider.defaults.domain = '192.168.1.26';
  });

  /*
  ** Index
  */
  app.controller('userIndex', function($scope, $window) {
    $scope.signup = function() {
      $window.location.href = '/signup';
    };

    $scope.signin = function() {
      $window.location.href = '/signin';
    };
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

    $scope.reset = function() {
      $window.location.href = '/reset';
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

    $scope.signin = function() {
      $window.location.href = '/signin';
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
  ** Activate
  */
  app.controller('userActivate', function($scope, $http, $window, $location, $cookies) {
    var url = $location.absUrl().split('/');
    var token = url[url.length - 1];

    $scope.validation = {
      success: false,
      error: false
    };

    $http({
      method: 'PUT',
      url: 'http://192.168.1.26:3000/api/user/activate',
      data: {
        token: token
      }
    })
    .then((result) => {
      $scope.validation = {
        success: true,
        error: false
      };
    })
    .catch((error) => {
      $scope.validation = {
        success: false,
        error: true
      };
    });
  });

  /*
  ** Update
  */
  app.controller('userUpdate', function($scope, $http, $window, $cookies) {
    // User datas
    $scope.user = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    };

    // Validation feedback popup
    $scope.validation = {
      display: false,
      title: '',
      context: ''
    };

    // Request user datas
    $http({
      method: 'POST',
      url: 'http://192.168.1.26:3000/api/user/read'
    })
    .then((result) => {
      $scope.user = {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        username: result.data.username,
        email: result.data.email
      };
    })
    .catch((error) => {
      $scope.validation = {
        display: true,
        title: 'Error',
        context: error.data.error
      };
    });

    // Send user datas
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
        $scope.validation = {
          display: true,
          title: 'All good',
          context: 'Your personal account informations have been saved.'
        };
        $scope.user.password = '';
      })
      .catch((error) => {
        console.error(error.data.error);
        $scope.validation = {
          display: true,
          title: 'Oops...',
          context: error.data.error
        };
      });
    }
  });

  /*
  ** Get informations and trainings
  */
  app.controller('userProfile', function($scope, $http, $cookies, $window) {
    $scope.trainings = [];
    $scope.countTrainings = 0;

    // Fetch trainings from database
    $http({
      method: 'POST',
      url: 'http://192.168.1.26:3000/api/training/read'
    })
    .then((result) => {
      $scope.trainings = result.data;
      $scope.countTrainings = $scope.trainings.length;
    })
    .catch((error) => {
      console.error(error.data.error);
    });

    // Sign out from current session and removes all cookies
    $scope.signout = function() {
      var cookies = $cookies.getAll();
      var total = Object.keys(cookies).length;
      var current = 0;

      angular.forEach(cookies, function (v, k) {
        $cookies.remove(k);
        current++;
        if (current == total) {
          $window.location.href = '/';
        }
      });
    };
  });
})();
