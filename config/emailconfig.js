const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  // host: process.env.EMAIL_HOST,
  service: "gmail",
  port: +process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, //Admin GMAIL ID
    pass: process.env.EMAIL_PASS, //Admin GMAIL Password of App testing purpose password
  },
});

module.exports = transporter;
