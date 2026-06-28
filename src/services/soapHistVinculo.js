import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistVinculo = async (histVinculos, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histVinculos.length} hist. vínculos ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaHistVinculo', { histVinculos }, uuidRun);

  logger.info('SOAP', `Hist. vínculos enviados com sucesso. Total: ${histVinculos.length}`, uuidRun);
  return { enviados: histVinculos.length, erros: 0 };
};