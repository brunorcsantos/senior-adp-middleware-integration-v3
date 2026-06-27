import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';

export const processaHistApuracao = async (histApuracoes, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${histApuracoes.length} hist. apurações ao Senior em uma única chamada`, uuidRun);

  await callOperation('ProcessaHistApuracao', { histApuracoes }, uuidRun);

  logger.info('SOAP', `Hist. apurações enviadas com sucesso. Total: ${histApuracoes.length}`, uuidRun);
  return { enviados: histApuracoes.length, erros: 0 };
};