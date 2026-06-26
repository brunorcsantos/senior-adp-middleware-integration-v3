import fs from 'fs';
import https from 'https';
import axios from 'axios';
import { env } from '../utils/envConfig.js';
import { logger } from '../utils/logger.js';

let cachedToken = null;
let tokenExpiresAt = null;

export const createMtlsAgent = () => {
  return new https.Agent({
    key: fs.readFileSync(env.certKey, 'utf8'),
    cert: fs.readFileSync(env.certCrt, 'utf8'),
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

  const response = await axios({
    method: 'POST',
    url: `${env.urlAdp}/auth/oauth/v2/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': undefined,
      'Accept': undefined,
    },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.clientId,
      client_secret: env.clientSecret,
    }),
    httpsAgent: agent,
  });

  cachedToken = response.data.access_token;
  tokenExpiresAt = Date.now() + response.data.expires_in * 1_000;

  logger.info('AUTH', `Novo token ADP obtido. Expira em ${response.data.expires_in}s`, uuidRun);

  return cachedToken;
};

export const getMtlsAgent = () => createMtlsAgent();