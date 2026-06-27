import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistCC = async (histCC, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histCC.length} hist. CC ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaHistCC', { histCC }, uuidRun);

  logger.info('SOAP', `Hist. CC enviados com sucesso. Total: ${histCC.length}`, uuidRun);
  return { enviados: histCC.length, erros: 0 };
};