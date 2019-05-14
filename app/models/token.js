var mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
	access_token:{
		type:String,
		required:true
	},
	token_secret:{
		type:String,
		required:true
	}
}) 

const TokenData = mongoose.model("TokenData",tokenSchema)

module.exports = TokenData;