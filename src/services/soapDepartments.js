import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaDepartamentos = async (departments, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${departments.length} departamentos ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaDepartamentos', { departamentos: departments }, uuidRun);

  logger.info('SOAP', `Departamentos enviados com sucesso. Total: ${departments.length}`, uuidRun);
  return { enviados: departments.length, erros: 0 };
};