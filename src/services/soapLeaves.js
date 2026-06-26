import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaAfastamentos = async (leaves, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${leaves.length} afastamentos ao Senior`, uuidRun);

  let enviados = 0;
  let erros = 0;

  for (const leave of leaves) {
    try {
      await callOperation('ProcessaAfastamentos', leave, uuidRun);
      enviados++;
    } catch (err) {
      logger.error('SOAP', `Erro ao enviar afastamento ${leave.UUIDSO}: ${err.message}`, uuidRun);
      erros++;
    }
  }

  logger.info('SOAP', `Afastamentos concluído. Enviados: ${enviados} | Erros: ${erros}`, uuidRun);
  return { enviados, erros };
};