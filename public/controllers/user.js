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
  ** Make cookies global over the domain
  **
  *****************************************************************************/
  app.config(function($cookiesProvider) {
    $cookiesProvider.defaults.path = '/';
    $cookiesProvider.defaults.domain = appHost;
  });

  /*****************************************************************************
  **
  ** Index
  **
  *****************************************************************************/
  app.controller('userIndex', function($scope, $window) {
    /* Redirect to sign up */
    $scope.signup = function() {
      $window.location.href = '/signup';
    };

    /* Redirect to sign in */
    $scope.signin = function() {
      $window.location.href = '/signin';
    };
  });

  /*****************************************************************************
  **
  ** Signin
  **
  *****************************************************************************/
  app.controller('userSignin', function($scope, $http, $window, $cookies) {
    /* Redirect to password reset */
    $scope.reset = function() {
      $window.location.href = '/reset/password';
    };

    /* Validation popup */
    $scope.validation = {
      display: false,
      title: 'Error',
      context: '',
      trigger: function(context) {
        this.display = true;
        this.context = context;
      }
    };

    /* Form datas */
    $scope.form = {
      /* Datas values */
      datas: {
        username: '',
        password: ''
      },
      /* Reset datas values */
      reset: function() {
        var self = this;
        var keys = Object.keys(self.datas);

        for (var i = 0 ; i < keys.length ; i++) {
          self.datas[keys[i]] = '';
        }
      },
      /* Pre-validate datas values */
      validate: function() {
        var self = this;

        if (!self.datas.username) {
          $scope.validation.trigger('Username is not allowed to be empty and must contain only alphanumerical values, underscores or dashes.');
        } else if (!self.datas.password || self.datas.password.length < 6) {
          $scope.validation.trigger('Password is not allowed to be empty and less than 6 characters long.');
        } else {
          return true;
        }
        return false;
      },
      /* Send datas to API */
      submit: function() {
        var self = this;

        if (!self.validate())
          return ;

        $http({
          method: 'POST',
          url: 'http://' + appAddr + '/api/user/signin',
          data: {
            username: self.datas.username,
            password: self.datas.password,
          }
        })
        .then(result => {
          $cookies.put('token', result.data);
          $window.location.href = '/dashboard';
        })
        .catch(error => {
          console.error(error.data);
          $scope.validation.trigger(error.data);
        });
      }
    };
  });

  /*****************************************************************************
  **
  ** Signup
  **
  *****************************************************************************/
  app.controller('userSignup', function($scope, $http, $window) {
    /* Redirect to signin */
    $scope.signin = function() {
      $window.location.href = '/signin';
    };

    /* Validation popup */
    $scope.validation = {
      display: false,
      title: '',
      context: '',
      trigger: function(success, context) {
        this.display = true;
        this.title = (success) ? 'Account created' : 'Error';
        this.context = context;
      }
    };

    /* Form datas */
    $scope.form = {
      /* Datas values */
      datas: {
        firstName: 'Razvan',
        lastName: 'Ludosanu',
        username: 'rludosanu',
        email: 'r.ludosanu@gmail.com',
        password: 'ludosanu'
      },
      /* Reset all datas values */
      reset: function() {
        var self = this;
        var keys = Object.keys(self.datas);

        for (var i = 0 ; i < keys.length ; i++) {
          self.datas[keys[i]] = '';
        }
      },
      /* Pre-validate data values */
      validate: function() {
        var self = this;

        if (!self.datas.firstName) {
          $scope.validation.trigger(false, 'First name is not allowed to be empty.');
        } else if (!self.datas.lastName) {
          $scope.validation.trigger(false, 'Last name is not allowed to be empty.');
        } else if (!self.datas.username) {
          $scope.validation.trigger(false, 'Username is not allowed to be empty.');
        } else if (!self.datas.email) {
          $scope.validation.trigger(false, 'Email address is not allowed to be empty.');
        } else if (!self.datas.password || self.datas.password.length < 6) {
          $scope.validation.trigger(false, 'Password is not allowed to be empty and less than 6 characters long.');
        } else {
          return true;
        }
        return false;
      },
      /* Send datas to API */
      submit: function() {
        var self = this;

        if (!self.validate())
          return ;

        $http({
         method: 'POST',
         url: 'http://' + appAddr + '/api/user/signup',
         data: {
           firstName: self.datas.firstName,
           lastName: self.datas.lastName,
           username: self.datas.username,
           email: self.datas.email,
           password: self.datas.password
         }
       })
       .then(result => {
         $scope.validation.trigger(true, 'Your account has been created, check your emails to activate it.');
         self.reset();
       })
       .catch(error => {
         $scope.validation.trigger(false, error.data);
       });
      }
    };
  });

  /*****************************************************************************
  **
  ** Signout
  **
  *****************************************************************************/
  app.controller('userSignout', function($scope, $http, $cookies, $window) {
    var cookies = $cookies.getAll();
    var total = Object.keys(cookies).length;
    var current = 0;

    if (!total) {
      $window.location.href = '/';
    }

    angular.forEach(cookies, function (v, k) {
      $cookies.remove(k);
      current++;
      if (current == total) {
        $window.location.href = '/';
      }
    });
  });

  /*****************************************************************************
  **
  ** Update Profile
  **
  *****************************************************************************/
  app.controller('userUpdateProfile', function($scope, $http) {
    /* Validation popup */
    $scope.validation = {
      display: false,
      title: '',
      context: '',
      trigger: function(success, context) {
        this.display = true;
        this.title = (success) ? 'Profile updated' : 'Error';
        this.context = context;
      }
    };

    /* Form */
    $scope.form = {
      /* Data values */
      datas: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
      },
      /* Pre-valide datas */
      validate: function() {
        var self = this;

        if (!self.datas.firstName) {
          $scope.validation.trigger(false, 'First name is not allowed to be empty.');
        } else if (!self.datas.lastName) {
          $scope.validation.trigger(false, 'Last name is not allowed to be empty.');
        } else if (!self.datas.username) {
          $scope.validation.trigger(false, 'Username is not allowed to be empty.');
        } else if (!self.datas.email) {
          $scope.validation.trigger(false, 'Email address is not allowed to be empty.');
        } else if (!self.datas.password || self.datas.password.length < 6) {
          $scope.validation.trigger(false, 'Password is not allowed to be empty and less than 6 characters long.');
        } else {
          return true;
        }
        return false;
      },
      /* Fetch datas from API */
      fetch: function() {
        var self = this;

        $http({
          method: 'POST',
          url: 'http://' + appAddr + '/api/user/read'
        })
        .then(result => {
          var keys = Object.keys(result.data);

          for (var i = 0 ; i < keys.length ; i++) {
            self.datas[keys[i]] = result.data[keys[i]];
          }
        })
        .catch(error => {
          popValidation(false, error.data, 'Database error');
        });
      },
      /* Send datas to API */
      submit: function() {
        var self = this;

        if (!self.validate())
          return ;

        $http({
          method: 'PUT',
          url: 'http://' + appAddr + '/api/user/update/profile',
          data: {
            firstName: self.datas.firstName,
            lastName: self.datas.lastName,
            username: self.datas.username,
            email: self.datas.email,
            password: self.datas.password
          }
        })
        .then(result => {
          $scope.validation.trigger(true, 'Your profile account informations have been saved.')
          self.datas.password = '';
        })
        .catch(error => {
          $scope.validation.trigger(false, error.data);
        });
      }
    };

    $scope.form.fetch();
  });

  /*****************************************************************************
  **
  ** Update Password
  **
  *****************************************************************************/
  app.controller('userUpdatePassword', function($scope, $http, $window, $cookies) {
    /* Validation popup */
    $scope.validation = {
      display: false,
      title: '',
      context: '',
      trigger: function(success, context) {
        this.display = true;
        this.title = (success) ? 'All good' : 'Validation error';
        this.context = context;
      }
    };

    /* Form */
    $scope.form = {
      /* Datas values */
      datas: {
        password: '',
        newPassword: '',
        newPasswordConfirmation: '',
      },
      /* Pre-validate datas*/
      validate: function() {
        var self = this;

        if (!self.datas.password || self.datas.password.length < 6) {
          $scope.validation.trigger(false, 'Password is not allowed to be empty and less than 6 characters long.');
        } else if (!self.datas.newPassword || self.datas.newPassword.length < 6) {
          $scope.validation.trigger(false, 'New password is not allowed to be empty and less than 6 characters long.');
        } else if (!self.datas.newPasswordConfirmation || self.datas.newPasswordConfirmation.length < 6) {
          $scope.validation.trigger(false, 'New password confirmation is not allowed to be empty and less than 6 characters long.');
        } else if (self.datas.newPassword !== self.datas.newPasswordConfirmation) {
          $scope.validation.trigger(false, 'New password and new password confirmation must be identical.');
        } else if (self.datas.password === self.datas.newPassword) {
          $scope.validation.trigger(false, 'Actual and new passwords must be different.');
        } else {
          return true
        }
        return false;
      },
      /* Reset all datas values */
      reset: function() {
        var self = this;
        var keys = Object.keys(self.datas);

        for (var i = 0 ; i < keys.length ; i++) {
          self.datas[keys[i]] = '';
        }
      },
      /* Send datas to API */
      submit: function() {
        var self = this;

        if (!self.validate())
          return ;

        $http({
          method: 'PUT',
          url: 'http://' + appAddr + '/api/user/update/password',
          data: {
            password: self.datas.password,
            newPassword: self.datas.newPassword
          }
        })
        .then(result => {
          $scope.validation.trigger(true, 'Your new password has been saved.');
          self.reset();
        })
        .catch(error => {
          $scope.validation.trigger(false, error.data);
        });
      }
    };
  });

  /*****************************************************************************
  **
  ** Reset Password
  **
  *****************************************************************************/
  app.controller('userResetPassword', function($scope, $http) {
    /* Validation popup */
    $scope.validation = {
      display: false,
      title: '',
      context: '',
      trigger: function(success, context) {
        this.display = true;
        this.title = (success) ? 'Password reset' : 'Validation error';
        this.context = context;
      }
    };

    /* Form */
    $scope.form = {
      /* Datas values */
      datas: {
        email: ''
      },
      /* Pre-validate datas */
      validate: function() {
        var self = this;

        if (!self.datas.email) {
          $scope.validation.trigger(false, 'Email address is not allowed to be empty');
        } else {
          return true;
        }
        return false;
      },
      /* Send datas to API */
      submit: function() {
        var self = this;

        if (!self.validate())
          return ;

        $http({
          method: 'PUT',
          url: 'http://' + appAddr + '/api/user/reset/password',
          data: {
            email: $scope.form.datas.email
          }
        })
        .then(result => {
          $scope.validation.trigger(true, 'Your password has been reset. Check your emails.');
          $scope.form.datas.email = '';
        })
        .catch(error => {
          $scope.validation.trigger(false, error.data);
        });
      }
    };
  });

  /*****************************************************************************
  **
  ** Get Trainings
  **
  *****************************************************************************/
  app.controller('userProfile', function($scope, $http, $cookies, $window) {
    $scope.trainings = [];
    $scope.countTrainings = 0;

    /* Fetch trainings from database */
    $http({
      method: 'POST',
      url: 'http://' + appAddr + '/api/training/read'
    })
    .then(result => {
      $scope.trainings = result.data;
      $scope.countTrainings = $scope.trainings.length;
    })
    .catch(error => {
      console.error(error.data);
    });
  });

  /*****************************************************************************
  **
  ** Activate Account
  **
  *****************************************************************************/
  app.controller('userActivate', function($scope, $http, $location) {
    var url = $location.absUrl().split('/');
    var token = url[url.length - 1];

    $scope.validation = {
      success: false,
      error: false
    };

    $http({
      method: 'PUT',
      url: 'http://' + appAddr + '/api/user/activate',
      data: {
        token: token
      }
    })
    .then(result => {
      $scope.validation = {
        success: true,
        error: false
      };
    })
    .catch(error => {
      $scope.validation = {
        success: false,
        error: true
      };
    });
  });
})();
