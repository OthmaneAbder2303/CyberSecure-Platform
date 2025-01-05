const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const forge = require('node-forge');

const app = express();
const port = 3000;

// Load CA's private key and certificate
const caPrivateKeyPem = fs.readFileSync('internal-ca/ca-key.pem', 'utf8');
const caPrivateKey = forge.pki.privateKeyFromPem(caPrivateKeyPem);

const caCertPem = fs.readFileSync('internal-ca/ca-cert.pem', 'utf8');
const caCert = forge.pki.certificateFromPem(caCertPem);

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to serve static files
app.use(express.static(__dirname));

// Function to sign data
function signData(data) {
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    const signature = caPrivateKey.sign(md);
    return forge.util.encode64(signature);
}

// Endpoint to handle document signing
app.post('/sign-document', upload.single('document'), (req, res) => {
    if (!req.file) {
        console.error('No document uploaded.');
        return res.status(400).send('No document uploaded.');
    }

    const documentType = req.body.documentType;

    // Read the uploaded file
    const filePath = path.join(__dirname, req.file.path);
    fs.readFile(filePath, (err, fileBuffer) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file.');
        }

        // Generate a digital signature using CA's private key
        const signature = signData(fileBuffer.toString('binary'));

        // Cleanup the uploaded file
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).send('Error deleting file.');
            }

            // Send the signature and document type back
            res.json({ signature, documentType });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
