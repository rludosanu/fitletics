const express = require('express');
const mustache = require('mustache-express');
const app = express();

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static('views'));

app.get('/', function (req, res) {
	res.render('login.html');
});

app.get('/register', function (req, res) {
	res.render('register.html');
});

app.get('/activate', function (req, res) {
	res.render('activate.html');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
});
