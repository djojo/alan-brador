var mongoose = require("mongoose");

var elementSchema = new mongoose.Schema(
  {
    title: String,
    order: Number,
    url: String,
    legend: String,
    description: String,
    tags:[],
    articleContent: [
      {
        subTitle: String,
        paragraph: String,
        quote: String
      }
    ],
    price: Number,
    nbCopy: Number,
    visible: Boolean,
    type: String,
    images: [],
    youtube: [String],
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section"
    },
    sectionId: String,
    sectionTitle: String,
    sectionUrl: String,
    date: Date,
    adress: String,
    comments: [
      {
        content: String,
        // userId: String,
        user: {
					type: mongoose.Schema.Types.ObjectId,
          ref: "User"
				}
      }
    ]
  },
  { timestamps: true });

module.exports = mongoose.model("Element", elementSchema);
