var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

const TYPE = {
	MENU: "Menu",
	PORTFOLIO: "Portfolio",
	SHOP: "Shop"
}

var sectionSchema = new mongoose.Schema({
	title: String,
	order: Number,
	elements: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Element"
	}],
	url: String,
	description: String,
	items: [],
	image: String,
	type: String,
	visible: Boolean,
    revealDate: Date,
	revealData: String,
	revealDataType: String,
	images: [],
    youtube: [String],
	webLinks: [{
		name: String,
		adress: String
	  }]
});

module.exports = mongoose.model("Section",sectionSchema);
