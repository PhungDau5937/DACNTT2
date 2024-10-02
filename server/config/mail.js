const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'englishgoforschool@gmail.com',
    pass: 'afip utbk hdam gyoc',
  },
});

module.exports = transporter;