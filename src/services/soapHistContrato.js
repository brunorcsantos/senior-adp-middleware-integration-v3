import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistContrato = async (histContratos, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histContratos.length} hist. contratos ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaHistContrato', { histContratos }, uuidRun);

  logger.info('SOAP', `Hist. contratos enviados com sucesso. Total: ${histContratos.length}`, uuidRun);
  return { enviados: histContratos.length, erros: 0 };
};