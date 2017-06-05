var User = require('../../models/user'); // get our mongoose model


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
