//jshint esversion:6
const nodemailer = require("nodemailer");

// console.log(module);

module.exports = sendMail;

function sendMail(html, text, subject, hostMail, title) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST_NAME, // hostname
    host: "in-v3.mailjet.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
      user: "d7f593119ed689b43afc7a7f1180dc05", // jetMail
      pass: "60d867fb0fdac726df793fc4c921f315", // jetMail 
      //user: process.env.AUTH_EMAIL, // generated ethereal user
      //pass: process.env.AUTH_PASS, // generated ethereal password
      //user: testAccount.user, // generated ethereal user
      //pass: testAccount.pass, // generated ethereal password
    },
  });

  var mailOptions = {
    from: '"'+title+'" <'+hostMail+'>', // sender address
    to: "geoffroy.rouaix@hotmail.com", // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  };

  // console.log(html + text + subject + hostMail + title);

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log("error: " + error)
          return error;
      }
      else{
        console.log('Message sent: ' + info.response);
      }
  });
};
