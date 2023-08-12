const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter=  nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: true,
  auth:{
      user:'flame1asd@gmail.com',  //ADmin Email
      pass:"kybphorforjfaso"      //Admin email password that is been gererated for app testing
  }
});

module.exports = transporter;
