var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
	no: Number,
	date: {type: Date, default: Date.now},
	firstName: String,
    lastName: String,
	address: {
		address: String,
		city: String,
		country: String,
		zipCode: String
	},
	phone: Number,
	paymentMode: String,
	checkoutCart: {
		items: [
			{ 
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Element' 
			}
		],
		cart_total: Number,
		discount: Number,
		total: Number
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: "User"
	}
});

module.exports = mongoose.model('Order',orderSchema);