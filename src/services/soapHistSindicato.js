import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistSindicato = async (histSindicatos, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histSindicatos.length} hist. sindicatos ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaHistSindicato', { histSindicatos }, uuidRun);

  logger.info('SOAP', `Hist. sindicatos enviados com sucesso. Total: ${histSindicatos.length}`, uuidRun);
  return { enviados: histSindicatos.length, erros: 0 };
};