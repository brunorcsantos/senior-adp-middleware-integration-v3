import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistCargo = async (histCargos, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histCargos.length} hist. cargos ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaHistCargo', { histCargos }, uuidRun);

  logger.info('SOAP', `Hist. cargos enviados com sucesso. Total: ${histCargos.length}`, uuidRun);
  return { enviados: histCargos.length, erros: 0 };
};