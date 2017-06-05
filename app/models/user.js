var mongoose = require('mongoose');
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
