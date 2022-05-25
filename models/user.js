var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

const ROLE = {
	BASIC: "Basic",
	ADMIN: "Admin",
	MODERATEUR: "Boss"
}

var userSchema = new mongoose.Schema({
	username: String,
  	email: String,
	password: String,
	pseudo: String,
  	firstName: String,
  	lastName: String,
  	role: String,
	phone: Number,
	cart: {
		items: [
			{
				element: {
					type: mongoose.Schema.Types.ObjectId,
	         		ref: "Element"
				},
				qty: Number
			}
		],
		cart_total: {type: Number, default: 0},
		discount: {type: Number, default: 0},
		total: {type: Number, default: 0}
	},
	orders: [
		{
			type: mongoose.Schema.Types.ObjectId,
	        ref: "Order"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);
