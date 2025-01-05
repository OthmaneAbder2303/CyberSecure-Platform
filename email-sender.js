const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configurer le transporteur SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'najem.khachoune123@gmail.com', // Votre adresse e-mail Gmail
        pass: 'itkn ecod kngf ryvq ' // Votre mot de passe Gmail ou le mot de passe spécifique à l'application
    }
});

// Charger le certificat et la clé privée pour la signature
const certificate = fs.readFileSync('internal-ca\\ca-cert.pem');
const privateKey = fs.readFileSync('internal-ca\\ca-key.pem');

// Contenu de l'e-mail à signer
const emailContent = 'Contenu de votre e-mail ici...';

// Créer une instance du signataire
const sign = crypto.createSign('SHA256');
sign.update(emailContent);

// Signer les données avec la clé privée
const signature = sign.sign(privateKey, 'base64');

// Ajouter la signature à l'e-mail
const signedEmail = `${emailContent}\n\nSignature: ${signature}`;

// Définir les options de l'e-mail
const mailOptions = {
    from: 'najem.khachoune123@gmail.com',
    to: 'najem.khachoune@gmail.com',
    subject: 'salutation',
    text: signedEmail
};

// Envoyer l'e-mail signé
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
    } else {
        console.log('E-mail signé envoyé avec succès:', info.response);
    }
});
