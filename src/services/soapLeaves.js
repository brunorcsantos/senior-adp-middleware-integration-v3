import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaAfastamentos = async (leaves, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${leaves.length} afastamentos ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaAfastamentos', { afastamentos: leaves }, uuidRun);

  logger.info('SOAP', `Afastamentos enviados com sucesso. Total: ${leaves.length}`, uuidRun);
  return { enviados: leaves.length, erros: 0 };
};