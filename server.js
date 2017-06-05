// =================================================================
// get the packages we need ========================================
// =================================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var config = require('./config'); // get our config file database
// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 3000; // used to create, sign, and verify tokens

mongoose.Promise = global.Promise;
mongoose.connect(config.database); // connect to database

//MongoClient.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable
var cors = require('cors');
app.use(cors()); // cors set up 
app.use(bodyParser.urlencoded({ extended: false }));// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
// routes URLS==========================================================
require('./app/route')(app);


// start the server ================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);