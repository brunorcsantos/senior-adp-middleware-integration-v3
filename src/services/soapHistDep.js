import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistDeptos = async (histDeptos, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histDeptos.length} hist. departamentos ao Senior`, uuidRun);

  let enviados = 0;
  let erros = 0;

  for (const dep of histDeptos) {
    try {
      await callOperation('ProcessaHistDeptos', dep, uuidRun);
      enviados++;
    } catch (err) {
      logger.error('SOAP', `Erro ao enviar hist.depto ${dep.UUIDSO}: ${err.message}`, uuidRun);
      erros++;
    }
  }

  logger.info('SOAP', `Hist. Deptos concluído. Enviados: ${enviados} | Erros: ${erros}`, uuidRun);
  return { enviados, erros };
};