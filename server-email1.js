const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/server-email1.js', (req, res) => {
  const { userName, userEmail, receiverEmail, emailSubject, emailContent } = req.body;

  // Generate certificate and key (dummy implementation)
  const certificate = '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----';
  const privateKey = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----';
  const timestamp = new Date().toISOString();

  // Save certificate, key, and timestamp to files
  fs.writeFileSync('certificate.pem', certificate);
  fs.writeFileSync('private-key.pem', privateKey);
  fs.writeFileSync('timestamp.txt', timestamp);

  // Encrypt email content using zaba.js (replace with your actual encryption logic)
  const encryptedContent = emailContent; // Replace with actual encryption logic from zaba.js

  // Send encrypted email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'benchelhahidaya@gmail.com',
      pass: 'Hidaya0804.'
    }
  });

  const mailOptions = {
    from: userEmail,
    to: receiverEmail,
    subject: emailSubject,
    text: encryptedContent
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: error.toString() });
    }
    res.json({ message: 'Encrypted email sent successfully!' });
  });
});

// Serve the form HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/email1.html');
});

app.listen(3000, () => {
  console.log('Server is running on port 8080');
});
