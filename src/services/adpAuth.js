import https from 'https';
import fs from 'fs';
import { env } from '../utils/envConfig.js';
import { logger } from '../utils/logger.js';

let cachedToken = null;
let tokenExpiresAt = null;

const createMtlsAgent = () => {
  return new https.Agent({
    key: fs.readFileSync(env.certKey),
    cert: fs.readFileSync(env.certCrt),
    rejectUnauthorized: true,
  });
};

const isTokenValid = () => {
  if (!cachedToken || !tokenExpiresAt) return false;
  return Date.now() < tokenExpiresAt - 30_000;
};

export const getAdpToken = async (uuidRun = '-') => {
  if (isTokenValid()) {
    logger.info('AUTH', 'Token ADP reutilizado do cache', uuidRun);
    return cachedToken;
  }

  logger.info('AUTH', 'Solicitando novo token ADP', uuidRun);

  const agent = createMtlsAgent();

  const credentials = Buffer.from(
    `${env.clientId}:${env.clientSecret}`
  ).toString('base64');

  const body = 'grant_type=client_credentials';

  const response = await fetch(`${env.urlAdp}/auth/oauth/v2/token`, {
    method: 'POST',
    agent,
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const detail = await response.text();
    logger.error('AUTH', `Falha ao obter token ADP: ${response.status} - ${detail}`, uuidRun);
    throw new Error(`ADP Auth falhou: ${response.status}`);
  }

  const data = await response.json();

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1_000;

  logger.info('AUTH', `Novo token ADP obtido. Expira em ${data.expires_in}s`, uuidRun);

  return cachedToken;
};

export const getMtlsAgent = () => createMtlsAgent();