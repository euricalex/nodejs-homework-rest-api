const nodemailer = require("nodemailer");


const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD
    }
  });

  // const message = {
  //  to: "urevaleksandr@gmail.com",
  //  from: "urevaleksandr@gmail.com" ,
  //  subject: "From Node JS with love",
  //  html: "<strong>Node JS is awesome<strong/>",
  //  text: "Node JS is awesome"
  // };
  function sendEmail(message) {
    message.from = "urevaleksandr@gmail.com";
return transport.sendMail(message);
  }

module.exports = sendEmail;
 