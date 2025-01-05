const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const forge = require('node-forge');
const pki = forge.pki;

const app = express();
const port = 3000; // Set a specific port for simplicity

app.use(express.static(__dirname)); // Serve static files from the root directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load CA private key and certificate
const caPrivateKeyPem = fs.readFileSync('internal-ca/ca-key.pem', 'utf8');
const caPrivateKey = pki.privateKeyFromPem(caPrivateKeyPem);

const caCertPem = fs.readFileSync('internal-ca/ca-cert.pem', 'utf8');
const caCert = pki.certificateFromPem(caCertPem);

function generateClientCertificate(commonName, email, organization, unit, country, state, city) {
    return new Promise((resolve, reject) => {
        try {
            const keys = pki.rsa.generateKeyPair(2048);

            const cert = pki.createCertificate();
            cert.publicKey = keys.publicKey;
            cert.serialNumber = (new Date().getTime()).toString();
            cert.validity.notBefore = new Date();
            cert.validity.notAfter = new Date();
            cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1); // Valid for 1 year
            cert.setSubject([
                { name: 'commonName', value: commonName },
                { name: 'emailAddress', value: email },
                { name: 'organizationName', value: organization },
                { name: 'organizationalUnitName', value: unit },
                { name: 'countryName', value: country },
                { name: 'stateOrProvinceName', value: state },
                { name: 'localityName', value: city }
            ]);
            cert.setIssuer(caCert.subject.attributes);
            cert.setExtensions([
                { name: 'basicConstraints', cA: false },
                { name: 'keyUsage', digitalSignature: true, keyEncipherment: true },
                { name: 'subjectKeyIdentifier' }
            ]);

            cert.sign(caPrivateKey);

            const pemCert = pki.certificateToPem(cert);
            resolve(pemCert);
        } catch (error) {
            reject(error);
        }
    });
}

app.post('/generate', (req, res) => {
    const { commonName, email, organization, unit, country, state, city } = req.body;

    generateClientCertificate(commonName, email, organization, unit, country, state, city)
        .then(cert => {
            
            res.send(`
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Certificat Généré</title>
                    <link rel="stylesheet" href="/css/generate.css"> <!-- Lien vers le CSS spécifique à /generate -->
                </head>
                <body>
                    <div id="certificateDisplay">
                        <h2>Certificat généré avec succès :</h2>
                        <pre>${cert}</pre>
                        <a href="/">Retour à l'accueil</a>
                    </div>
                </body>
                </html>
            `);
        })
        .catch(error => {
            res.status(500).send({ error: error.message });
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
