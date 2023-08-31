const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter=  nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: true,
  auth:{
      user:'flame100622@gmail.com',  //ADmin Email
      pass:"kybphorforjfasof"      //Admin email password that is been gererated for app testing
  }
});

module.exports = transporter;

// this is to test the branch push