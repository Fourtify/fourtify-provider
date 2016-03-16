var dotenv = require('dotenv');
dotenv.load();
var environment = process.env.NODE_ENV;

var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var morgan = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var request = require('request');

var mongoose = require('mongoose');
var configDB = require('./config/database.json')[environment];

var app = express();

mongoose.connect(configDB.host, configDB.db, configDB.port,
    configDB.credentials,
    function(err) {
        if (err) {
            throw err;
        }
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(compression());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next){
    res.setHeader("X-Powered-By", "Fourtify");
    res.setHeader("Connection", "keep-alive");
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 604800000 }));
app.use('/bower', express.static(path.join(__dirname, 'bower_components'), { maxAge: 604800000 }));

//Sessions
app.use(session({
    secret: process.env.EXPRESS_SECRET,
    store: new MongoStore({
        db : configDB.db,
        collection: "sessions",
        host: configDB.host,
        port: configDB.port,
        username: configDB.credentials.user,
        password: configDB.credentials.pass,
        autoReconnect: true
    }),
    resave:false,
    saveUninitialized: true
}));


var AuthMiddleware = require("./modules/authentication/src/AuthMiddleware");


var authenticationModule = require('./modules/authentication/app');
app.use(authenticationModule);

var employeeModule = require('./modules/employees/app');
app.use(employeeModule);

var visitorsModule = require('./modules/visitors/app');
app.use(visitorsModule);

var appointmentsModule = require('./modules/appointments/app');
app.use(appointmentsModule);

var  queueHistoryModule = require('./modules/queueHistory/app');
app.use(queueHistoryModule);

var  queueModule = require('./modules/queue/app');
app.use(queueModule);

var formsModule = require('./modules/forms/app');
app.use(formsModule);

var settingsModule = require('./modules/settings/app');
app.use(settingsModule);

app.use("/slack",function(req,res){
    // "use strict";
    require("./modules/slack/public/SlackPost");
    res.status(200).send("Hooray");
})
app.all("/api/myself", AuthMiddleware.authenticateApi(), function(req, res){
    res.status(200).send({
        provider: req.session.provider,
        employee: req.session.employee
    });
});

app.all("/api", AuthMiddleware.authenticateApi(), function(req, res){
    request({
            headers: {
                "Authorization": "Bearer "+req.session.accessToken._value,
                "user-agent": req.headers["user-agent"]
            },
            method: req.method,
            uri: "http://localhost:3001"+req.headers.url,
            qs: req.query,
            json: req.body
        },
        function (error, response, body) {
            if (error) {
                console.log(error);
                return res.status(500).send({_code:"PROVIDER-APP002", _msg:"Connection to API failed. Please try again later."});
            }
            res.status(response.statusCode).send(body);
        });
});


var engine = require('./modules/engine/app');
app.use(engine);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('index', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
