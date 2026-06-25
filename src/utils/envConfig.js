import 'dotenv/config';

const requiredVars = [
  'PORT',
  'HTTPS',
  'CERT_KEY',
  'CERT_CRT',
  'CLIENT_ID',
  'CLIENT_SECRET',
  'URL_ADP',
  'URL_G5',
  'MODULO_G5',
  'USUARIO_G5',
  'SENHA_G5',
  'WEB_SERVICE_G5',
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`[envConfig] Variáveis obrigatórias ausentes: ${missing.join(', ')}`);
  process.exit(1);
}

export const env = {
  port: parseInt(process.env.PORT, 10) || 3000,
  https: process.env.HTTPS?.toLowerCase() === 'sim',
  certKey: process.env.CERT_KEY,
  certCrt: process.env.CERT_CRT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  urlAdp: process.env.URL_ADP,
  urlG5: process.env.URL_G5,
  moduloG5: process.env.MODULO_G5,
  usuarioG5: process.env.USUARIO_G5,
  senhaG5: process.env.SENHA_G5,
  webServiceG5: process.env.WEB_SERVICE_G5,
  batchSize: parseInt(process.env.BATCH_SIZE, 10) || 50,
  allowConcurrent: process.env.ALLOW_CONCURRENT?.toLowerCase() === 'true',
  useMock: process.env.USE_MOCK?.toLowerCase() === 'true',
};