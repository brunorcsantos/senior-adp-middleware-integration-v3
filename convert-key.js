import fs from 'fs';
import crypto from 'crypto';

const pkcs8Pem = fs.readFileSync('./certs/companyname_auth.key', 'utf8');

const privateKey = crypto.createPrivateKey(pkcs8Pem);

const pkcs1Pem = privateKey.export({
  type: 'pkcs1',
  format: 'pem',
});

fs.writeFileSync('./certs/companyname_auth_rsa.key', pkcs1Pem, 'utf8');

console.log('Conversão concluída.');
console.log('Primeiros 40 caracteres:', pkcs1Pem.substring(0, 40));