const nodemailer = require("nodemailer");
require("dotenv").config()
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: process.env.MAILING_HOST,
  port: 465,
  secure: true, 
  auth: {
    user: process.env.NODEMAILER_EM,
    pass: process.env.NODEMAILER_PD,
  },
});

module.exports={transporter}