var user_controller = require('./user_controller');

module.exports = function (app) {   
    
    //get all users
    app.get('/v1/users', user_controller.userList);

    //get by userid
    app.get('/v1/users/:userId', user_controller.userById);

    //update user
    app.get('/v1/users/update', user_controller.updateUser);

    //delete the user
    app.delete('/v1/users/:userId', user_controller.removeUser);
};