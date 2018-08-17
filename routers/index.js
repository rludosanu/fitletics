const express = require('express');
const path = require('path');

class ClientRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();

    /* Set up static files directory */
    this.router.use('/public', express.static(path.join(__dirname, '../public')));

    /* Set up routing */
    this.router.get('/', (req, res) => res.render('index'));
    this.router.get('/404', (req, res) => res.render('404'));
    this.router.get('/*', (req, res) => res.redirect('/404'));
  }
}

class UserRouter {
  constructor(app) {
    this._app = app;
    this.router = express.Router();

    /* Create */
    this.router.post('/', this._app.controllers.user.create.bind(this));

    /* Read */
    this.router.get('/:token', this._app.controllers.user.read.bind(this));

    /* Update */
    this.router.update('/', this._app.controllers.user.update.bind(this));

    /* Delete */
    this.router.delete('/', this._app.controllers.user.destroy.bind(this));
  }
}

class Router {
  constructor(app) {
    this._app = app;

    this.client = new ClientRouter(app);
    this.user = new UserRouter(app);
  }
}

module.exports = Router;
