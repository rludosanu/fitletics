const express = require('express');
const path = require('path');
const morgan = require('morgan');

class ClientRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();

    /* Debug */
    this.router.use(morgan('dev'));

    /* Set up static files directory */
    this.router.use('/public', express.static(path.join(__dirname, '../public')));

    /* Set up routing */
    this.router.get('/', (req, res) => res.render('index'));

    this.router.get('/signin', (req, res) => res.render('signin'));

    this.router.get('/signup', (req, res) => res.render('signup'));

    this.router.get('/activate/:token', (req, res) => res.render('activate'));

    this.router.get('/dashboard', (req, res) => res.render('dashboard'));

    this.router.get('/workout', (req, res) => res.render('workout'));

    this.router.get('/workout/:id/preview', (req, res) => res.render('workout-preview'));

    this.router.get('/workout/:id/live', (req, res) => res.render('workout-live'));

    this.router.get('/exercise', (req, res) => res.render('exercise'));

    this.router.get('/exercise/:id/preview', (req, res) => res.render('exercise-preview'));

    this.router.get('/exercise/:id/live/:repetitions', (req, res) => res.render('exercise-live'));

    this.router.get('/user/profile', (req, res) => res.render('user-profile'));

    this.router.get('/user/settings', (req, res) => res.render('user-settings'));

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

    /*
    ** Create a new user account and send an activation link.
    */
    this.router.post('/signup', this._app.controllers.user.signup.bind(this));

    /*
    ** Check user username and password and return a json web token.
    */
    this.router.post('/signin', this._app.controllers.user.signin.bind(this));

    /*
    ** Get user account informations using a json web token.
    */
    this.router.get('/read', this._app.controllers.user.read.bind(this));

    /*
    ** Update user account informations using a json web token.
    */
    this.router.put('/update', this._app.controllers.user.update.bind(this));

    /*
    ** Activate user account.
    */
    this.router.put('/activate', this._app.controllers.user.activate.bind(this));

    /*
    ** Deactivate user account without deleting anything.
    */
    this.router.delete('/deactivate', this._app.controllers.user.deactivate.bind(this));
  }
}

class TrainingRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();
  }
}

class WorkoutRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();
  }
}

class ExerciseRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();
  }
}

class Router {
  constructor(app) {
    this._app = app;

    this.client = new ClientRouter(app);
    this.user = new UserRouter(app);
    this.training = new TrainingRouter(app);
    this.workout = new WorkoutRouter(app);
    this.exercise = new ExerciseRouter(app);
  }
}

module.exports = Router;
