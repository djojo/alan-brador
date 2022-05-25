//jshint esversion:6

const https = require("https");

module.exports = subscribeMailChimp;

function subscribeMailChimp(email, firstName, lastName) {
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  //const mailchimpApiKey = "22bf05055afaaa7571e5023410991704-us20";
  //const mailchimplUniqueId = "648e75f4c1";
  const url = "https://us20.api.mailchimp.com/3.0/lists/648e75f4c1";
  const options = {
    method: "POST",
    auth: process.env.MAIL_CHIMP_CREDENTIALS
  };
  const request = https.request(url, options, function(response){
    if(response.statusCode == 200){
      // return true;
    }
    response.on("data", function(data){
    });
  });
  request.write(jsonData);
  request.end();
};
