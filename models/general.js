var mongoose = require("mongoose");

var generalSchema = new mongoose.Schema(
  {
    config: String,
    contactMail: String,
    socialLinks: [{
      name: String,
      adress: String
    }],
    bio: String,
    homeMessage: String,
    elementShowcaseId: String,
    error404Message: String,
    showcaseElements: [
			{ 
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Element' 
			}
		],
    // cartVisible: Boolean,
    eCommerce: Boolean,
    webZine: Boolean,
    contactVisible: Boolean,
    aboutVisible: Boolean,
    backgroundImage: String
  },
  { timestamps: true });

module.exports = mongoose.model("General", generalSchema);
