import { env } from './envConfig.js';
import { logger } from './logger.js';

logger.info('TEST', 'envConfig carregado com sucesso');
logger.info('TEST', `Porta configurada: ${env.port}`);
logger.warn('TEST', 'Exemplo de warning');
logger.error('TEST', 'Exemplo de erro', 'uuid-teste-123');
