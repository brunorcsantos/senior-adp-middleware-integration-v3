import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaRun = async (runData, uuidRun = '-') => {
  logger.info('SOAP', `Registrando execução UUIDRUN: ${runData.UUIDRUN}`, uuidRun);

  return callOperation('ProcessaRun', {
    UUIDRUN: runData.UUIDRUN,
    DTINICIO: runData.DTINICIO ?? null,
    DTFIM: runData.DTFIM ?? null,
    STATUS: runData.STATUS,
    TOTALWKR: runData.TOTALWKR ?? 0,
    TOTALDEP: runData.TOTALDEP ?? 0,
    TOTALAFA: runData.TOTALAFA ?? 0,
    TOTALHDP: runData.TOTALHDP ?? 0,
    TOTALHCC: runData.TOTALHCC ?? 0,
    ERROS: runData.ERROS ?? 0,
  }, uuidRun);
};