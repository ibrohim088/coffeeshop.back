import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

const transporter = nodemailer.createTransport({
   host : process.env.SMTP_HOST,
   port : 587,
   secure: false,
   auth : {
      user : process.env.SMTP_USER,
      pass : process.env.SMTP_PASSWORD
   }
})

module.exports = transporter