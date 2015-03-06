'use strict';

/*
 * Module dependencies.
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var errorHandler = require('errorhandler');
var path = require('path');
var mongoose = require('mongoose');

/*
 * App configs
 */
var config = require('./config/config');
var validate = require('./config/validation');
var winstonConfig = require("./config/winston");

/*
 * Create Express server.
 */
var app = express();

app.use(morgan('dev', {"stream": winstonConfig.stream}));


/*
 * Connect to MongoDB.
 */
mongoose.connect(config.mongoDBUrl);
mongoose.connection.on('connected', function() {
  console.log('MongoDB connected succesfully at: ' + config.mongoDBUrl);

});

mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');

});

/*
 * Express configuration.
 */
app.set('port', config.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../dist')));


require('./routes')(app);

/*
 * DEPRECATED. Please move these routes to routes.js
 * and modify the ./routes files accordingly
 */
var user = require('./routes/user');
var product = require('./routes/product');
var theme = require('./routes/theme');
var employee = require ('./routes/employee');
var auth = require('./routes/auth');

app.use('/auth', auth);
app.use('/api/*', validate);
app.use('/api', user);
app.use('/api', product);
app.use('/api', theme);
app.use('/api', employee);

/*
 * Error Handler.
 */
app.use(errorHandler());

/*
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.info('Express server listening on port %d in %s mode',
    app.get('port'),
    app.get('env'));


});

module.exports = app;
