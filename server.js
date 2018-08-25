const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const mustacheExpress = require('mustache-express');
const path = require('path');
const accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'});

const Config = require('./config/index');
const Database = require('./database/index');
const Models = require('./models/index');
const Controllers = require('./controllers/index');
const Routers = require('./routers/index');

class Server {
	constructor(config) {
		/* Confirguration file */
		this.config = config;

		this.database = new Database(this);
		this.models = new Models(this);
		this.controllers = new Controllers(this);
		this.routers = new Routers(this);

		/* App */
		this.app = express();

		/* App log */
		this.app.use(morgan('common', {stream: accessLogStream}));

		/* HTTP request parser */
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json({ type: 'application/json' }));

		/* Mustache templating engine */
		this.app.engine('html', mustacheExpress());
		this.app.set('view engine', 'html');
		this.app.set('view cache', false);
		this.app.set('views', path.join(__dirname, '/public/views'));

		/* Client view router */
		this.app.use(this.routers.client.router);

		/* User API router */
		this.app.use('/api/user', this.routers.user.router);

		/* Workout API router */
		this.app.use('/api/workout', this.routers.workout.router);

		/* Exercise API router */
		this.app.use('/api/exercise', this.routers.exercise.router);

		/* Training API router */
		this.app.use('/api/training', this.routers.training.router);

		/* Server */
		this.server = http.createServer(this.app);
	}

	start() {
		/* Connect to database */
		this.database.connect();

		/* Run server */
		this.server.listen(this.config.server.port, (error) => {
			if (error) {
				console.log(error);
				process.exit(1);
			}
			console.log('Express server is running on port ' + this.config.server.port);
		});
	}
}

const server = new Server(Config);

server.start();
