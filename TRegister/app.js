/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

//var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
//var routes = require('./routes/allinone');
//var users = require('./routes/users');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var passport = require('./passport');
var root = require('./routes/root');
var cloudant = require('./routes/cloudant');
var template = require('./routes/template');

// create a new express server
var app = express();


app.set('view engine', 'jade');
app.set('views', './views')
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: false, secret: 'keyboard cat'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', root);
app.use('/dispatcher', template);

//app.use('/service', cloudant);
app.get('/data', cloudant.findAll);
//
//app.get('/wines', cloudant.findAll);
//app.get('/users', cloudant.findAllUsers);
app.get('/data/:id', cloudant.findById);
app.post('/data', cloudant.add);
//app.post('/wines/:query', cloudant.search);
app.put('/data/:id', cloudant.update);
app.delete('/data/:id', cloudant.deleteBy_Id);
app.get('/courseFind/:courseId',cloudant.findCourse);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
