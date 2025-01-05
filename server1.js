const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Set a specific port for simplicity

app.use(express.static(__dirname)); // Serve static files from the root directory
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de multer pour enregistrer temporairement les fichiers téléchargés
const upload = multer({ dest: 'uploads/' });

app.post('/sign-document', upload.single('document'), (req, res) => {
    if (!req.file) {
        console.error('No document uploaded.');
        return res.status(400).send('No document uploaded.');
    }

    const documentType = req.body.documentType;

    // Log le nom du fichier téléchargé pour vérifier
    console.log('Fichier téléchargé:', req.file.originalname);

    // Lire le fichier téléchargé
    const filePath = path.join(__dirname, req.file.path);
    fs.readFile(filePath, (err, fileBuffer) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file.');
        }

        // Générer un hachage SHA-256 du contenu du fichier
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        
        console.log('Signature générée:', hash);

        // Supprimer le fichier après avoir généré la signature
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).send('Error deleting file.');
            }

            // Réponse avec la signature
            res.json({
                signature: hash,
                documentType: documentType
       
            });
   
        });

    });
});   

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});