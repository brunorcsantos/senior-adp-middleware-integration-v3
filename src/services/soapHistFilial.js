import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistFilial = async (histFiliais, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histFiliais.length} hist. filiais ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaHistFilial', { histFiliais }, uuidRun);

  logger.info('SOAP', `Hist. filiais enviados com sucesso. Total: ${histFiliais.length}`, uuidRun);
  return { enviados: histFiliais.length, erros: 0 };
};