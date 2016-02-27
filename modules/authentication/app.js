var express = require('express');
var path = require('path');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/pub/authentication', express.static(path.join(__dirname, 'public')));

app.use(require('./routes/routes.js'));

module.exports = app;
