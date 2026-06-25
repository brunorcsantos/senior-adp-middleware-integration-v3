import http from 'http';
import https from 'https';
import fs from 'fs';
import { env } from './utils/envConfig.js';
import { logger } from './utils/logger.js';
import app from './app.js';

const startServer = () => {
  if (env.https) {
    const certKey = fs.readFileSync(env.certKey);
    const certCrt = fs.readFileSync(env.certCrt);

    const options = {
      key: certKey,
      cert: certCrt,
    };

    https.createServer(options, app).listen(env.port, () => {
      logger.info('SERVER', `Servidor HTTPS iniciado na porta ${env.port}`);
    });
  } else {
    http.createServer(app).listen(env.port, () => {
      logger.info('SERVER', `Servidor HTTP iniciado na porta ${env.port}`);
    });
  }
};

startServer();