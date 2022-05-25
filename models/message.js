var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    content: String,
    phone: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
