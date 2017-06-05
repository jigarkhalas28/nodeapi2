var User = require('./models/user'); // get our mongoose model
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