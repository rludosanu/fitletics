const express = require('express');
const path = require('path');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

class ClientRouter {
  constructor(app) {
    this._app = app;

    this.checkToken = function(req, res, next) {
      var self = this;

      if (!req.cookies || !req.cookies.token) {
        res.redirect('/');
      } else {
        jwt.verify(req.cookies.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
          if (error) {
            res.redirect('/');
          } else {
            next();
          }
        });
      }
    };

    /* Valid session token */
    this.isTokenValid = function(req, res, next) {
      var self = this;

      if (!req.cookies || !req.cookies.token) {
        res.redirect('/');
      } else {
        jwt.verify(req.cookies.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
          if (error) {
            res.redirect('/');
          } else {
            next();
          }
        });
      }
    };

    /* Create new Express router */
    this.router = express.Router();

    /* Debug */
    this.router.use(morgan('dev'));

    /* Parse cookies */
    this.router.use(cookieParser());

    /* Set up static files directory */
    this.router.use('/public', express.static(path.join(__dirname, '../public')));

    /* Unlogged routing */
    this.router.get('/', (req, res) => res.render('index'));
    this.router.get('/signin', (req, res) => res.render('signin'));
    this.router.get('/signup', (req, res) => res.render('signup'));
    this.router.get('/activate/:token', (req, res) => res.render('activate'));
    this.router.get('/reset/password', (req, res) => res.render('user-reset-password'));

    /* Logged routing */
    this.router.get('/dashboard', this.isTokenValid.bind(this), (req, res) => res.render('dashboard'));
    this.router.get('/workout', this.isTokenValid.bind(this), (req, res) => res.render('workout'));
    this.router.get('/workout/:id/preview', this.isTokenValid.bind(this), (req, res) => res.render('workout-preview'));
    this.router.get('/workout/:id/live', this.isTokenValid.bind(this), (req, res) => res.render('workout-live'));
    this.router.get('/exercise', this.isTokenValid.bind(this), (req, res) => res.render('exercise'));
    this.router.get('/exercise/:id/preview', this.isTokenValid.bind(this), (req, res) => res.render('exercise-preview'));
    this.router.get('/exercise/:id/live/:repetitions', this.isTokenValid.bind(this), (req, res) => res.render('exercise-live'));
    this.router.get('/user/profile', this.isTokenValid.bind(this), (req, res) => res.render('user-profile'));
    this.router.get('/user/settings', this.isTokenValid.bind(this), (req, res) => res.render('user-settings'));
    this.router.get('/user/update/password', this.isTokenValid.bind(this), (req, res) => res.render('user-update-password'));
    this.router.get('/user/update/profile', this.isTokenValid.bind(this), (req, res) => res.render('user-update-profile'));

    /* Error routing */
    this.router.get('/404', (req, res) => res.render('404'));
    this.router.get('/*', (req, res) => res.redirect('/404'));
  }
}

class UserRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();

    /* Debug */
    this.router.use(morgan('dev'));

    /* Create a new user account and send an activation link */
    this.router.post('/signup', this._app.controllers.user.signup.bind(this));

    /* Check user username and password */
    this.router.post('/signin', this._app.controllers.user.signin.bind(this));

    /* Update user account informations */
    this.router.put('/update/profile', this._app.controllers.user.updateProfile.bind(this));

    /* Update user password */
    this.router.put('/update/password', this._app.controllers.user.updatePassword.bind(this));

    /* Reset user password and send it by email */
    this.router.put('/reset/password', this._app.controllers.user.resetPassword.bind(this));

    /* Get user account informations */
    this.router.post('/read', this._app.controllers.user.read.bind(this));

    /* Activate user account */
    this.router.put('/activate', this._app.controllers.user.activate.bind(this));

    /* Deactivate user account */
    this.router.put('/deactivate', this._app.controllers.user.deactivate.bind(this));
  }
}

class WorkoutRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();

    /* Get all workouts */
    this.router.post('/', this._app.controllers.workout.readAll.bind(this));

    /* Get one workout */
    this.router.post('/:id', this._app.controllers.workout.readOne.bind(this));
  }
}

class ExerciseRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();

    /* Get all exercises */
    this.router.post('/', this._app.controllers.exercise.readAll.bind(this));

    /* Get one exercise */
    this.router.post('/:id', this._app.controllers.exercise.readOne.bind(this));
  }
}

class TrainingRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();

    /* Create a new training */
    this.router.post('/create', this._app.controllers.training.create.bind(this));

    /* Get all trainings */
    this.router.post('/read', this._app.controllers.training.read.bind(this));
  }
}

class Router {
  constructor(app) {
    this._app = app;

    this.client = new ClientRouter(app);
    this.user = new UserRouter(app);
    this.workout = new WorkoutRouter(app);
    this.exercise = new ExerciseRouter(app);
    this.training = new TrainingRouter(app);
  }
}

module.exports = Router;
