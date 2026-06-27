import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistDeptos = async (histDeptos, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histDeptos.length} hist. departamentos ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaHistDeptos', { histDeptos }, uuidRun);

  logger.info('SOAP', `Hist. deptos enviados com sucesso. Total: ${histDeptos.length}`, uuidRun);
  return { enviados: histDeptos.length, erros: 0 };
};