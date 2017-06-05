var Place = require('../models/place'); // get our mongoose model
var jwt = require('jsonwebtoken');// used to create, sign, and verify tokens


module.exports = function (app) {

    //add new place
    app.post('/v1/clients/:clientId/places', function (req, res) {

        // create a sample user
        var savePlace = new Place({
            name: req.body.name,
            address: req.body.address,
            isActive: req.body.isActive,
            clientId: req.params.clientId,
            created_on: new Date(),
            updated_on: new Date()
        });
        savePlace.save(function (err) {
            if (err) throw err;

            console.log('Client saved successfully');
            res.json({ success: true });
        });
    });

    //get all places
    app.get('/v1/clients/:clientId/places', function (req, res) {
        Place.find({ "clientId": req.params.clientId }, function (err, places) {
            res.json(places);
        });
    });

    //get by placeId
    app.get('/v1/clients/:clientId/places/:placeId', function (req, res) {
        return Place.findById(req.params.placeId, function (err, place) {
            if (!err) {
                return res.send(place);
            } else {
                return console.log(err);
            }
        });
    });

    //update places
    app.put('/v1/clients/:clientId/places', function (req, res) {                
        return Place.findById(req.body._id, function (err, place) {            
            if (!err) {

                place.name = req.body.name;
                place.address = req.body.address;
                place.clientId = req.body.clientId;
                

                // save the place
                place.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({ success: "update Successfully!!" });
                });

            } else {
                //return console.log(err);

                res.json({ error: err });
            }
        });
    });

    //delete the places
    app.delete('/v1/clients/:clientId/places/:placeId', function (req, res) {
        Place.remove({
            _id: req.params.placeId
        }, function (err, place) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
};;var User = require('../../models/user'); // get our mongoose model


// Display list of all Users
module.exports.userList = function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });    
};

// Display User by Id
module.exports.userById = function (req, res) {
    return User.findById(req.params.userId, function (err, user) {
        if (!err) {
            return res.send(user);
        } else {
            return console.log(err);
        }
    });
};

// Update User
module.exports.updateUser = function (req, res) {
    return User.findById(req.body.userId, function (err, user) {
        console.log(req);
        if (!err) {

            user.name = req.body.name;

            // save the bear
            user.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ success: "update Successfully!!" });
            });

        } else {
            //return console.log(err);

            res.json({ error: err });
        }
    });
};

// Delete User
module.exports.removeUser = function (req, res) {
    User.remove({
        _id: req.params.userId
    }, function (err, user) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};
;var user_controller = require('./user_controller');

module.exports = function (app) {   
    
    //get all users
    app.get('/v1/users', user_controller.userList);

    //get by userid
    app.get('/v1/users/:userId', user_controller.userById);

    //update user
    app.get('/v1/users/update', user_controller.updateUser);

    //delete the user
    app.delete('/v1/users/:userId', user_controller.removeUser);
};;var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Place', new Schema({
    name: String,
    address: String,
    isActive: Boolean,
    clientId: String,
    created_on: Date,
    updated_on: Date
}));;var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	email:String,
	password: String,
	salt:String,
	admin: Boolean,
	clientAdmin: Boolean,	
});
// set up a mongoose model
module.exports = mongoose.model('User', UserSchema);
;var User = require('./models/user'); // get our mongoose model
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var crypto = require('crypto'); //using this encryption and decryption password


module.exports = function (app) {
    var salt;
    var hash;

    //create the first admin
    app.post('/v1/register', function (req, res) {
        console.log("Entered into api");
        this.salt = crypto.randomBytes(16).toString('hex');

        // create a sample user
        var saveUser = new User({
            name: req.body.name,
            password: crypto.pbkdf2Sync(req.body.password, this.salt, 1000, 64, 'sha1').toString('hex'),
            salt: this.salt,
            email: req.body.email,
            admin: false
        });
        console.log("Entered into api 2");
        saveUser.save(function (err) {
            console.log("Entered into save");
            if (err) throw err;

            console.log('User saved successfully');
            res.json({ success: true });
        });
    });

    //check the user login or not
    app.post('/v1/login', function (req, res) {
        // find the user
        User.findOne({
            email: req.body.email
        }, function (err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                var hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64).toString('hex');

                // check if password matches
                if (user.password != hash) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
    });

    //forgotpassword
    app.post('/v1/forgotpassword', function (req, res) {
        // find the user
        User.findOne({
            email: req.body.email
        }, function (err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {
                //TODO : send the email;
                res.json({ user: user });
            }
        });
    });

    // route middleware to verify a token
    app.use(function (req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.authorization || req.query.authorization || req.headers.authorization;//['x-access-token'];
        // decode token
        console.log(token);
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    app.post('/v1/users/changepassword', function (req, res) {
        console.log("test");
        this.salt = crypto.randomBytes(16).toString('hex');

        return User.findById(req.body.userId, function (err, user) {
            if (!err) {
                user.password = crypto.pbkdf2Sync(req.body.password, this.salt, 1000, 64, 'sha1').toString('hex');
                user.salt = this.salt;

                // save the user
                user.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({ success: "update Successfully!!" });
                });
            } else {
                return console.log(err);
            }
        });

    });

    //set the route of the api call
    require('./api/user/users')(app);
    require('./api/places')(app);
};