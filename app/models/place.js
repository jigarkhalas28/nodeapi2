var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Place', new Schema({
    name: String,
    address: String,
    isActive: Boolean,
    clientId: String,
    created_on: Date,
    updated_on: Date
}));