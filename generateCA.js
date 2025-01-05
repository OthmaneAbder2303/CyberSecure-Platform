const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

// Generate a keypair and create an X.509v3 certificate
const pki = forge.pki;
const keys = pki.rsa.generateKeyPair(2048);
const cert = pki.createCertificate();

cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);

const attrs = [
  { name: 'commonName', value: 'My Internal CA' },
  { name: 'countryName', value: 'US' },
  { shortName: 'ST', value: 'California' },
  { name: 'localityName', value: 'San Francisco' },
  { name: 'organizationName', value: 'My Company' },
  { shortName: 'OU', value: 'IT' }
];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.setExtensions([
  { name: 'basicConstraints', cA: true },
  { name: 'keyUsage', keyCertSign: true, digitalSignature: true, nonRepudiation: true, keyEncipherment: true, dataEncipherment: true },
  { name: 'extKeyUsage', serverAuth: true, clientAuth: true, codeSigning: true, emailProtection: true, timeStamping: true },
  { name: 'nsCertType', client: true, server: true, email: true, objsign: true, sslCA: true, emailCA: true, objCA: true },
  { name: 'subjectKeyIdentifier' }
]);

cert.sign(keys.privateKey, forge.md.sha256.create());

// PEM-format keys and cert
const pemPrivateKey = pki.privateKeyToPem(keys.privateKey);
const pemCert = pki.certificateToPem(cert);

// Create CA directory if it doesn't exist
if (!fs.existsSync('internal-ca')) {
  fs.mkdirSync('internal-ca');
}

// Save to files
fs.writeFileSync(path.join('internal-ca', 'ca-key.pem'), pemPrivateKey);
fs.writeFileSync(path.join('internal-ca', 'ca-cert.pem'), pemCert);

console.log('CA generated and saved to ca-key.pem and ca-cert.pem');
