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

app.get('/forgot', function (req, res) {
	res.render('forgot.html');
});

app.get('/signup', function (req, res) {
	res.render('signup.html');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
});
