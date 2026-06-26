import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';
import { env } from '../utils/envConfig.js';

export const processaDepartamentos = async (departments, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${departments.length} departamentos ao Senior`, uuidRun);

  let enviados = 0;
  let erros = 0;

  for (const dep of departments) {
    try {
      await callOperation('ProcessaDepartamentos', dep, uuidRun);
      enviados++;
    } catch (err) {
      logger.error('SOAP', `Erro ao enviar departamento ${dep.UUIDSO}: ${err.message}`, uuidRun);
      erros++;
    }
  }

  logger.info('SOAP', `Departamentos concluído. Enviados: ${enviados} | Erros: ${erros}`, uuidRun);
  return { enviados, erros };
};