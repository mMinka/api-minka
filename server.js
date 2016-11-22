// BASE SETUP
// =============================================================================
// =====================================
// get the packages we need ============
// =====================================
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var cors = require('cors');
var jwt = require('jsonwebtoken');
// configure app
app.use(morgan('dev')); // log requests to the console
// configure body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8082; // set our port
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/api-v1'); // connect to our database
//app.set('secret','minka24');
//configure routes for our api
var routesPerson = require('./routes/person');
var routesTransfer = require('./routes/transfer');
var routesChannel = require('./routes/channel');
// REGISTER OUR ROUTES -------------------------------
app.use('/person', routesPerson);
app.use('/transfer', routesTransfer);
app.use('/channel', routesChannel);
// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
// =============================================================================
