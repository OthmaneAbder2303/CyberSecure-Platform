// zaba.js
const crypto = require('crypto');

function encryptEmailContent(content, certificate) {
  // Use the public key from the certificate to encrypt the content
  const publicKey = crypto.createPublicKey(certificate);
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(content));
  return encrypted.toString('base64');
}

module.exports = { encryptEmailContent };
