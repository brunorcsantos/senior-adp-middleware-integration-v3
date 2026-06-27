import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaWorkers = async (workers, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${workers.length} workers ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaWorkers', { workers }, uuidRun);

  logger.info('SOAP', `Workers enviados com sucesso. Total: ${workers.length}`, uuidRun);
  return { enviados: workers.length, erros: 0 };
};