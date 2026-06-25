import express from 'express';
import { logger } from './utils/logger.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  logger.info('HEALTH', 'Health check solicitado');
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;