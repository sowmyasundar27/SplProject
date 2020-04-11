var express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session');
var mongoose = require('mongoose');
// access module.exports in express is function
var app = express();
var connectionDB = require('./utils/connectionDB');

// say use ejs as default engine
app.set('view engine' , 'ejs');

app.use(session({secret: 'ssunda12', resave: true,
    saveUninitialized: true}));

app.use(bodyParser.urlencoded({
  extended: true

}));

// For assets urls , fire middleware
//map to assets folder and get static files
app.use('/assets', express.static('assets'));
app.use('/images', express.static('images'));

var connectionslist = connectionDB.getConnections();

// The routes for all url paths
var indexroute = require('./routes/index.js');
app.use('/index', indexroute);

var connectionsroute  = require('./routes/connections.js');
app.use('/connections', connectionsroute);

var connectionroute  = require('./routes/connection.js');
app.use('/connection', connectionroute);

var savedConnectionsroute = require('./routes/ProfileController.js');
app.use('/savedConnections', savedConnectionsroute)

var newConnectionroute = require('./routes/newConnection.js');
app.use('/newConnection', newConnectionroute)

var editConnectionroute = require('./routes/editConnection.js');
app.use('/editConnection', editConnectionroute)

var contactroute = require('./routes/contact.js');
app.use('/contact', contactroute);

var aboutroute = require('./routes/about.js');
app.use('/about', aboutroute);

var loginroute = require('./routes/login.js');
app.use('/login', loginroute);

var signuproute = require('./routes/signup.js');
app.use('/signup', signuproute);

app.use('/', indexroute);

app.listen(3000);
