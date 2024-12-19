// Import environment file details
require('dotenv').config();

// Import mailer
const nodemailer = require('nodemailer');

// Setup sender profile
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'process.end.EMAIL_USER',
    pass: 'process.env.EMAIL_PASS',
  },
});

// Construct mail message
const mailOptions = {
  from: 'process.end.EMAIL_USER',
  to: 'recipient-email@example.com',
  subject: 'Subject',
  text: 'Email body content',
};

// Track errors
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error: ' + error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
