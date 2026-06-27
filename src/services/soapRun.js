import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaRun = async (runData, uuidRun = '-') => {
  logger.info('SOAP', `Registrando execução UUIDRUN: ${runData.UUIDRUN}`, uuidRun);

  return callOperation('ProcessaRun', {
    UUIDRUN: runData.UUIDRUN,
    STATUS: runData.STATUS,
    TOTALWKR: runData.TOTALWKR ?? 0,
    TOTALDEP: runData.TOTALDEP ?? 0,
    TOTALAFA: runData.TOTALAFA ?? 0,
    TOTALHDP: runData.TOTALHDP ?? 0,
    TOTALHCC: runData.TOTALHCC ?? 0,
    TOTALHCA: runData.TOTALHCA ?? 0,
    TOTALHES: runData.TOTALHES ?? 0,
    TOTALHFI: runData.TOTALHFI ?? 0,
    TOTALHCO: runData.TOTALHCO ?? 0,
    TOTALAPU: runData.TOTALAPU ?? 0,
    TOTALHVI: runData.TOTALHVI ?? 0,
    TOTALHSI: runData.TOTALHSI ?? 0,
    ERROS: runData.ERROS ?? 0,
  }, uuidRun);
};