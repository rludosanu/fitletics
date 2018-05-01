const express = require('express');
const mustache = require('mustache-express');
const app = express();

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static('views'));

/*
** Basic Routes
*/
app.get('/', function(req, res) {
	res.render('login.html');
});

app.get('/register', function(req, res) {
	res.render('register.html');
});

app.get('/activate', function(req, res) {
	res.render('activate.html');
});

app.get('/forgot', function(req, res) {
	res.render('forgot.html');
});

/*
** API Routes
*/
app.post('/api/user/login', function(req, res) {
	//
});

app.post('/api/user/register', function(req, res) {
	//
});

app.put('/api/user/activate', function(req, res) {
	//
});

app.post('/api/user/forgot/reset', function(req, res) {
	//
});

app.post('/api/user/forgot/confirm', function(req, res) {
	//
});

/*
** Start server
*/
app.listen(3000, function() {
	console.log('Example app listening on port 3000!')
});
