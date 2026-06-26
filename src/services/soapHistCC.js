import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistCC = async (histCC, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histCC.length} hist. CC ao Senior`, uuidRun);

  let enviados = 0;
  let erros = 0;

  for (const cc of histCC) {
    try {
      await callOperation('ProcessaHistCC', cc, uuidRun);
      enviados++;
    } catch (err) {
      logger.error('SOAP', `Erro ao enviar hist.CC ${cc.UUIDSO}: ${err.message}`, uuidRun);
      erros++;
    }
  }

  logger.info('SOAP', `Hist. CC concluído. Enviados: ${enviados} | Erros: ${erros}`, uuidRun);
  return { enviados, erros };
};