import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistEscala = async (histEscalas, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histEscalas.length} hist. escalas ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaHistEscala', { histEscalas }, uuidRun);

  logger.info('SOAP', `Hist. escalas enviados com sucesso. Total: ${histEscalas.length}`, uuidRun);
  return { enviados: histEscalas.length, erros: 0 };
};